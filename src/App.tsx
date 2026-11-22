import { Navigate, Route, Routes } from "react-router-dom";
import { useDemo } from "./store";
import Landing from "./pages/Landing";
import GuestHome from "./pages/GuestHome";
import GuestFood from "./pages/GuestFood";
import GuestRequests from "./pages/GuestRequests";
import GuestChat from "./pages/GuestChat";
import GuestMore from "./pages/GuestMore";
import Reception from "./pages/Reception";
import Kitchen from "./pages/Kitchen";
import Owner from "./pages/Owner";
import StaffLogin from "./pages/StaffLogin";
import DemoLayout from "./components/DemoLayout";

export default function App() {
  const { toast } = useDemo();
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<DemoLayout />}>
          <Route path="/guest" element={<GuestHome />} />
        <Route path="/guest/food" element={<GuestFood />} />
        <Route path="/guest/requests" element={<GuestRequests />} />
        <Route path="/guest/chat" element={<GuestChat />} />
        <Route path="/guest/more" element={<GuestMore />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/staff" element={<StaffLogin />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
