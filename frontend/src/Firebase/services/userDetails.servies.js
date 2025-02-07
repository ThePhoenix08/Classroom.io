import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';

const addProfile = async (userDetails, userId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user found');
    }

    
    const userProfileRef = doc(db, 'UserProfiles', userId); 


    await setDoc(userProfileRef, {
      userId: userId,
      ...userDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, docRef: userProfileRef };
  } catch (error) {
    console.error('Error adding user details:', error);
    throw error;
  }
};

export default addProfile;

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
