import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import NavBar from "../components/Navbar";
import { auth } from "../lib/firebase";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      navigate("/login", { replace: true });
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const profileLabel =
    currentUser?.displayName?.trim()?.[0] ||
    currentUser?.email?.trim()?.[0] ||
    "U";

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black text-blue-50">
      <NavBar />

      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-36">
        <div className="rounded-2xl border border-white/20 bg-black/60 p-6 md:p-8">
          <h1 className="special-font text-5xl uppercase md:text-7xl">
            pr<b>o</b>file
          </h1>

          {isLoading ? (
            <p className="mt-6 font-circular-web text-blue-50/80">
              Loading profile...
            </p>
          ) : (
            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start">
              <div className="shrink-0">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="profile"
                    className="size-28 rounded-full border border-white/30 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex size-28 items-center justify-center rounded-full border border-white/30 bg-white/10 text-4xl uppercase">
                    {profileLabel}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                <div className="w-full rounded-xl border border-white/10 bg-black/50 p-4">
                  <p className="font-general text-xs uppercase text-blue-50/60">
                    Username
                  </p>
                  <p className="mt-1 break-words font-circular-web text-base">
                    {currentUser?.displayName || "Not provided"}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-white/10 bg-black/50 p-4">
                  <p className="font-general text-xs uppercase text-blue-50/60">
                    Email
                  </p>
                  <p className="mt-1 break-words font-circular-web text-base">
                    {currentUser?.email || "Not provided"}
                  </p>
                </div>

                <div className="w-full rounded-xl border border-white/10 bg-black/50 p-4">
                  <p className="font-general text-xs uppercase text-blue-50/60">
                    Avatar Source
                  </p>
                  <p className="mt-1 break-all font-circular-web text-base">
                    {currentUser?.photoURL || "Default avatar"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/"
                    className="rounded-full bg-blue-75 px-5 py-3 font-general text-black"
                  >
                    Back to Home
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-white/25 px-5 py-3 font-general text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProfilePage;
