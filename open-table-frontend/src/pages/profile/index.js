import { useState, useEffect } from "react";
import { Container, CircularProgress, Snackbar, Alert } from "@mui/material";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AccountDetails from "@/components/profile/AccountDetails";
import ReservationsPanel from "@/components/profile/ReservationsPanel";

export default function ProfilePage() {
    const [tab, setTab] = useState(0);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  
    useEffect(() => {
      async function loadProfile() {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/profile", { credentials: "include" });
          if (!res.ok) throw new Error("Failed to fetch profile");
          const { data } = await res.json();
          setProfile(data);
        } catch (e) {
          setSnackbar({ open: true, message: e.message, severity: "error" });
        } finally {
          setLoading(false);
        }
      }
      loadProfile();
    }, []);
  
    if (loading) {
      return (
        <Container sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      );
    }
  
    return (
      <ProfileLayout
        sidebar={<ProfileSidebar selected={tab} onSelect={setTab} />}
        header={<ProfileHeader firstName={profile.firstName} lastName={profile.lastName} />}
      >
        {tab === 0 ? (
          <AccountDetails profile={profile} />
        ) : (
          <ReservationsPanel />
        )}
  
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ProfileLayout>
    );
  }
