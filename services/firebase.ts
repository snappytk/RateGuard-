import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User as FirebaseUser,
  signOut as firebaseSignOut
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc,
  serverTimestamp,
  increment,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  writeBatch,
  arrayUnion,
  runTransaction
} from "firebase/firestore";
import { UserProfile, QuoteData, LiveRate, Audit, Organization } from "../types";

// Helper for Robust Env Vars
const getEnv = (key: string) => {
  let value = '';
  if (import.meta && (import.meta as any).env) {
    value = (import.meta as any).env[`VITE_${key}`] || 
            (import.meta as any).env[`NEXT_PUBLIC_${key}`] || 
            (import.meta as any).env[key] || 
            '';
  }
  if (value) return value;
  if (typeof process !== 'undefined' && process.env) {
    value = process.env[`VITE_${key}`] || 
            process.env[`NEXT_PUBLIC_${key}`] || 
            process.env[key] || 
            '';
  }
  return value;
};

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY"),
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("FIREBASE_APP_ID")
};

if (!firebaseConfig.apiKey) console.warn("RateGuard: Firebase API Key is missing.");

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };

// --- CORE: SYNC LOGIC ---
export const syncUserAndOrg = async (user: FirebaseUser): Promise<{ userProfile: UserProfile, orgProfile: Organization | null }> => {
  try {
    const userRef = doc(db, "users", user.uid);
    let userSnap = await getDoc(userRef);

    const defaultProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Agent',
        role: 'member',
        credits: 5,
        hasSeenIntro: false,
        createdAt: Date.now(),
        lastSeen: Date.now(),
        companyName: '',
        country: '',
        taxID: ''
    };

    if (!userSnap.exists()) {
      await setDoc(userRef, JSON.parse(JSON.stringify(defaultProfile)));
      await setDoc(doc(db, "settings", user.uid), { profitThreshold: 2.0, autoAudit: true });
      userSnap = await getDoc(userRef);
    }

    const userData = { ...defaultProfile, ...userSnap.data() } as UserProfile;

    if (userData.orgId) {
       const orgSnap = await getDoc(doc(db, "organizations", userData.orgId));
       if (orgSnap.exists()) {
         return {
           userProfile: userData,
           orgProfile: { id: orgSnap.id, ...orgSnap.data() } as Organization
         };
       } else {
         await updateDoc(userRef, { orgId: null });
         userData.orgId = undefined; 
       }
    }
    return { userProfile: userData, orgProfile: null };
  } catch (error) {
    console.error("Critical Sync Error:", error);
    return { userProfile: { uid: user.uid, email: user.email, displayName: 'Offline', role: 'member', credits: 0 }, orgProfile: null };
  }
};

// --- ORG MANAGEMENT ---
export const createOrganization = async (userId: string, orgData: Partial<Organization>) => {
  const newOrgData = {
    name: orgData.name || 'New Organization',
    adminId: userId,
    members: [userId],
    plan: 'free',
    maxSeats: 5,
    createdAt: Date.now()
  };
  const orgRef = await addDoc(collection(db, "organizations"), newOrgData);
  await updateDoc(doc(db, "users", userId), { orgId: orgRef.id, role: 'admin' });
  return orgRef.id;
};

export const joinOrganization = async (userId: string, orgId: string) => {
  try {
    const orgRef = doc(db, "organizations", orgId);
    const userRef = doc(db, "users", userId);
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error("User does not exist.");
      const userData = userDoc.data() as UserProfile;
      if (userData.orgId) throw new Error("Already in an organization.");
      const orgDoc = await transaction.get(orgRef);
      if (!orgDoc.exists()) throw new Error("Organization not found.");
      const orgData = orgDoc.data() as Organization;
      if (orgData.members.includes(userId)) return;
      transaction.update(orgRef, { members: arrayUnion(userId) });
      transaction.update(userRef, { orgId: orgId, role: 'member' });
    });
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
};

export const markIntroSeen = async (userId: string) => {
  try { await updateDoc(doc(db, "users", userId), { hasSeenIntro: true }); return true; } catch (e) { return false; }
};

// --- AUTH ---
export const handleGoogleSignIn = async () => (await signInWithPopup(auth, googleProvider)).user;
export const handleEmailSignUp = async (email: string, pass: string, name: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(res.user, { displayName: name });
  await sendEmailVerification(res.user);
  await firebaseSignOut(auth);
};
export const handleEmailSignIn = async (email: string, pass: string) => {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  if (!res.user.emailVerified) { await firebaseSignOut(auth); throw new Error("Email not verified."); }
  return res.user;
};
export const signOut = async () => { await firebaseSignOut(auth); };
export const onAuthStateChanged = (cb: (user: FirebaseUser | null) => void) => onFirebaseAuthStateChanged(auth, cb);

// --- DATA ---
export const fetchOrgQuotes = async (orgId: string): Promise<QuoteData[]> => {
  try {
    const q = query(collection(db, "quotes"), where("orgId", "==", orgId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const quotes: QuoteData[] = [];
    querySnapshot.forEach((doc) => quotes.push({ id: doc.id, ...doc.data() } as QuoteData));
    return quotes;
  } catch (error) { console.error(error); return []; }
};

export const saveQuoteToFirestore = async (userId: string, orgId: string, quoteData: Partial<QuoteData>, pdfBase64: string, geminiRaw: any): Promise<{success: true, id: string, [key: string]: any} | {success: false, error: any}> => {
  try {
    if (!userId || !orgId) throw new Error("Missing ID.");

    // SAFETY CHECK: Firestore limit is 1MB. If file is close to limit, do NOT save base64.
    let safePdfBase64: string | null = pdfBase64;
    const sizeInBytes = (pdfBase64.length * 3) / 4; // Approx base64 decoding size
    if (sizeInBytes > 900000) { // 900KB limit
        console.warn("PDF too large for Firestore document. Saving metadata only.");
        safePdfBase64 = null; 
    }

    const amount = Number(quoteData.amount) || 0;
    const markupCost = quoteData.markupCost !== undefined ? Number(quoteData.markupCost) : amount * 0.022;
    
    const newQuote = {
      userId,
      orgId,
      status: markupCost > 200 ? 'flagged' : 'analyzed',
      workflowStatus: 'uploaded',
      bank: quoteData.bank || 'Unknown Bank',
      pair: quoteData.pair || 'USD/EUR',
      amount: amount,
      exchangeRate: Number(quoteData.exchangeRate) || 1.0,
      midMarketRate: Number(quoteData.midMarketRate) || 0,
      markupCost: markupCost,
      totalCost: Number(quoteData.totalCost) || 0,
      fees: quoteData.fees || [],
      valueDate: quoteData.valueDate || new Date().toISOString().split('T')[0],
      disputeDrafted: !!quoteData.disputeDrafted,
      pdfBase64: safePdfBase64,
      geminiRaw,
      createdAt: Date.now(),
      reliabilityScore: 85,
      notes: []
    };

    // Remove undefined
    const sanitizedQuote = JSON.parse(JSON.stringify(newQuote));

    const docRef = await addDoc(collection(db, "quotes"), sanitizedQuote);
    await updateDoc(doc(db, "users", userId), { credits: increment(-1) });

    return { success: true, id: docRef.id, ...newQuote };
  } catch (error: any) {
    console.error("Save Quote Error:", error);
    return { success: false, error: error.message };
  }
};

// --- BILLING ---
export const processEnterpriseUpgrade = async (userId: string, orgId: string, paypalId: string) => {
  try {
    await setDoc(doc(db, "transactions", paypalId), {
      userId, orgId, amount: 231.00, status: "COMPLETED", createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, "organizations", orgId), { plan: "enterprise", maxSeats: 999 });
    return true;
  } catch (error) { return false; }
};

// --- UTILS ---
export const updateComplianceProfile = async (userId: string, data: any) => updateDoc(doc(db, "users", userId), data);
export const fetchUserSettings = async (userId: string) => {
  const snap = await getDoc(doc(db, "settings", userId));
  return snap.exists() ? snap.data() : null;
};
export const updateUserSettings = async (userId: string, settings: any) => updateDoc(doc(db, "settings", userId), settings);
export const updateUserProfileData = async (userId: string, data: Partial<UserProfile>) => updateDoc(doc(db, "users", userId), data);
export const addTeammateByUID = async (ownerUid: string, colleagueUid: string) => {
  try {
    if (ownerUid === colleagueUid) throw new Error("Cannot invite self.");
    const ownerSnap = await getDoc(doc(db, "users", ownerUid));
    const orgId = ownerSnap.data()?.orgId;
    if (!orgId) throw new Error("Owner has no Org.");
    const colRef = doc(db, "users", colleagueUid);
    const colSnap = await getDoc(colRef);
    if (!colSnap.exists()) throw new Error("User ID not found.");
    if (colSnap.data()?.orgId === orgId) throw new Error("Already in team.");
    const batch = writeBatch(db);
    batch.update(colRef, { orgId: orgId, role: 'member' });
    batch.update(doc(db, "organizations", orgId), { members: arrayUnion(colleagueUid) });
    await batch.commit();
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
};

// --- REAL-TIME RATES LISTENER ---
export const listenToRates = (cb: (rates: LiveRate[]) => void) => {
  const q = query(collection(db, "rates"));
  return onSnapshot(q, (snapshot) => {
    const rates: LiveRate[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Map Firestore "Backend" format to Frontend "LiveRate" format
      rates.push({
        id: doc.id,
        pair: doc.id.replace('_', '/'),
        timestamp: data.date_time ? data.date_time.toMillis() : Date.now(),
        midMarketRate: data.rate,
        bankRate: data.bank_spread,
        rateGuardRate: data.rate * 1.003, // Internal "Fair" rate logic (0.3% markup)
        savingsPips: Math.round(data.leakage * 10000),
        trend: Math.random() > 0.5 ? 'up' : 'down' // Trend is calculated visually or needs history
      });
    });
    cb(rates);
  });
};

export const updateLiveRates = async () => {};
export const listenToOrgAudits = (orgId: string, cb: (audits: Audit[]) => void) => {
  if (!orgId) return () => {};
  const q = query(collection(db, "audits"), where("orgId", "==", orgId), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({id: d.id, ...d.data()} as Audit))));
};
export const saveAudit = async (data: any) => addDoc(collection(db, "audits"), { ...data, timestamp: Date.now() });
export const logAnalyticsEvent = (name: string, data: any) => console.log(name, data);