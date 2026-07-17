import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Propos } from "./pages/Propos";
import { Prestations } from "./pages/Prestations";
import { Contact } from "./pages/Contact";
import { LoginPage } from "./Login";
import { ComptePage } from "./Compte";
import { CoursPage } from "./pages/Cours";
import { TravailChevalPage } from "./pages/TravailCheval";
import { ReeducationPage } from "./pages/Reeducation";
import { EducationEquinePage } from "./pages/EducationEquine";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "a-propos", element: <Propos /> },
      { path: "prestations", element: <Prestations /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <LoginPage /> },
      { path: "compte", element: <ComptePage /> },
      { path: "cours", element: <CoursPage /> },
      { path: "travail-cheval", element: <TravailChevalPage /> },
      { path: "reeducation", element: <ReeducationPage /> },
      { path: "education-equine", element: <EducationEquinePage /> },
    ],
  },
]);