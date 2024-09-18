import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, getauth } from "../Firebase/Firebase";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { UploadImage } from "./UploadImage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserStore } from "./useStore";

type FirebaseContextType = {
    signup: (params: { email: string; password: string, username: string, file: any }) => Promise<void>;
    signin: (params: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
};


const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error("useFirebase must be used within a FirebaseProvider");
    }
    return context;
};

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate()
    const { currentUser } = useUserStore();
    // window load status change
    window.addEventListener("beforeunload", async (event:any) => {
        event.preventDefault()
        if (currentUser) {
          await updateDoc(doc(db, "users", currentUser.id), {
            status: "offline",
            lastOnline: serverTimestamp(),
          });
        }
      });


        const [authStatus, setAuthStatus] = useState<{
            signupSuccess?: boolean;
            signinSuccess?: boolean;
            logoutSuccess?: boolean;
        }>({
            signupSuccess: undefined,
            signinSuccess: undefined,
            logoutSuccess: undefined,
        });

        const signup = async ({ email, password, username, file }: { email: string; password: string, username: string, file: any }) => {
            console.log("User signed up:", file);
            try {
                const res = await createUserWithEmailAndPassword(getauth, email, password);
                // Handle successful signup, e.g., save the user data
                const imgurl = await UploadImage(file.file)
                console.log(imgurl)
                await setDoc(doc(db, "users", res.user.uid), {
                    username,
                    email,
                    avatar: imgurl,
                    id: res.user.uid,
                    blocked: [],
                    status: 'online',
                    lastOnline: serverTimestamp(),
                });

                await setDoc(doc(db, "userchats", res.user.uid), {
                    chats: []
                });
                setAuthStatus((prev: any) => ({ ...prev, signupSuccess: true }));
                toast.success("Signup successful! Redirecting to chat...");
                navigate('/'); // Navigate to chat page on successful signup
            } catch (error) {
                // Handle errors here
                setAuthStatus((prev: any) => ({ ...prev, signupSuccess: false }));
                console.error("Signup error:", error);
            }
        };

        const signin = async ({ email, password }: { email: string; password: string }) => {
            try {
                const res = await signInWithEmailAndPassword(getauth, email, password);
                setAuthStatus((prev: any) => ({ ...prev, signinSuccess: true })); // navigate('/chat');  // Optionally, navigate to a protected page
                navigate('/chat'); // Navigate to chat page on successful signin
                toast.success('Successful login');
                await updateDoc(doc(db, "users", res.user.uid), {
                    status: "online",
                });
            } catch (err: any) {
                setAuthStatus((prev: any) => ({ ...prev, signinSuccess: false }));
                toast.error(err.message || 'Login error');
            }
        };
        const logout = async () => {
            try {
                const res = await signOut(getauth);
                console.log('res logout', res)

                setAuthStatus((prev) => ({ ...prev, logoutSuccess: true }));
                toast.success("Logged out successfully!");
                navigate('/'); // Navigate to home page or login page after logout
                const user = currentUser.id;
                if (user) {
                    // Set status to offline before logging out
                    await updateDoc(doc(db, "users", user), {
                        status: "offline",
                        lastOnline: serverTimestamp(),
                    });
                }
            } catch (error) {
                setAuthStatus((prev) => ({ ...prev, logoutSuccess: false }));
                toast.error('Logout failed. Please try again.');
                console.error("Logout error:", error);
            }
        };
        useEffect(() => {
            if (authStatus.signupSuccess) {
                console.log("Signup successful! Redirecting to chat...")
            }
            if (authStatus.signupSuccess === false) {
                toast.error("Signup failed. Please try again.");
            }
        }, [authStatus.signupSuccess, navigate]);

        useEffect(() => {
            if (authStatus.signinSuccess) {
                console.log('Successful login');
            }
            if (authStatus.signinSuccess === false) {
                toast.error("Login failed. Please check your credentials.");
            }
        }, [authStatus.signinSuccess, navigate]);
        useEffect(() => {
            if (authStatus.logoutSuccess) {
                console.log("Logged out successfully!");
            }
        }, [authStatus.logoutSuccess, navigate]);
        return (
            <FirebaseContext.Provider value={{ signup, signin, logout }}>
                {children}
            </FirebaseContext.Provider>
        );
    };
