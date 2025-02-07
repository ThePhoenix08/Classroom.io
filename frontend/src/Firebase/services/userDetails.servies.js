import { db } from '../firebase';
import { doc, addDoc, collection, where, updateDoc, getDocs, getDoc, query, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';

const addProfile = async (userDetails, userId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user found');
    }
    // Reference to the user profile document using userId
    const userProfileRef = doc(db, 'UserProfiles', userId);


    // Save the user profile data, including nested personalInfo, socialLinks, and background
    await setDoc(userProfileRef, {

    const docRef = await addDoc(collection(db, 'UserProfiles'), {

      userId: userId,
      personalInfo: userDetails.personalInfo,
      socialLinks: userDetails.socialLinks,
      background: userDetails.background,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding user details:', error);
    throw error;
  }
};



export default addProfile;
/** get user profile of specified user (userId) */
const getUserProfileByUserId = async (userId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user found');
    }

    const userDetailsCollectionRef = collection(db, 'UserProfiles');
    const q = query(userDetailsCollectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.length === 0) {
      throw new Error('No user details entity found');
    } else if (querySnapshot.length > 1) {
      throw new Error('Multiple user details entities found');
    }

    if (querySnapshot.length > 0) {
      return { id: userDetails[0].data.id, ...userDetails[0].data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};

const updateUserProfile = async (userId, updates) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user found');
    }

    const userDetailsCollectionRef = collection(db, 'UserProfiles');
    const q = query(userDetailsCollectionRef, where("userId", "==", userId));
    const userDetails = await getDoc(q);
    if (userDetails) {
      const docRef = doc(userDetailsCollectionRef, userDetails.id);
      const updatedUserDetails = await updateDoc(
        docRef,
        {
          updates,
          modifiedAt: serverTimestamp()
        }
      );

      return {
        id: updatedUserDetails.id,
        ...updatedUserDetails.data()
      };
    } else {
      throw new Error('User details not found');
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

export { addProfile, getUserProfileByUserId, updateUserProfile };

