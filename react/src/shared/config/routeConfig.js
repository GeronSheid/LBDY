import {
    ABOUT_UNIVERSITY,
    AUTH_ROUTE, CONTACTS,
    KNOWLEDGE_BASE,
    MAIN_ROUTE, PROFILE,
    RECOVERY_ROUTE,
    REGISTRATION_ROUTE,
    PHONE_ALREADY_IS,
    PROJECT,
    PAGE_NOT_FOUND
} from "shared/consts/paths";
import {AuthorizationPage} from "pages/AuthorizationPage";
import {RegistrationPage} from "pages/RegistrationPage";
import {PasswordRecoveryPage} from "pages/PasswordRecoveryPage";
import {MainPage} from "pages/MainPage";
import {KnowledgeBasePage} from "pages/KnowlegeBasePage";
import {AboutUniversityPage} from "pages/AboutUniversityPage";
import {ProfilePage} from "pages/ProfilePage";
import {ContactsPage} from "pages/ContactsPage";
import { RegistrationPhoneAlreadyIs } from "entities/RegistrationPhoneAlreadyIs";
import ProjectPage from "pages/ProjectPage/ui/ProjectPage";
import { AcceptNewPhonePage } from "pages/AcceptNewPhonePage";

export const routeConfig = [
    {
        path: AUTH_ROUTE,
        element: <AuthorizationPage />,
        authOnly: false
    },
    {
        path: REGISTRATION_ROUTE,
        element: <RegistrationPage />,
        authOnly: false
    },
    {
        path: PHONE_ALREADY_IS,
        element: <RegistrationPhoneAlreadyIs />,
        authOnly: false
    },
    {
        path: PAGE_NOT_FOUND,
        element: <AcceptNewPhonePage />,
        authOnly: true
    },
    {
        path: PROJECT,
        element: <ProjectPage />,
        authOnly: true
    },
    {
        path: RECOVERY_ROUTE,
        element: <PasswordRecoveryPage />,
        authOnly: false
    },
    {
        path: MAIN_ROUTE,
        element: <MainPage />,
        authOnly: true
    },
    {
        path: KNOWLEDGE_BASE,
        element: <KnowledgeBasePage />,
        authOnly: true
    },
    {
        path: ABOUT_UNIVERSITY,
        element: <AboutUniversityPage />,
        authOnly: true
    },
    {
        path: PROFILE,
        element: <ProfilePage />,
        authOnly: true
    },
    {
        path: CONTACTS,
        element: <ContactsPage />,
        authOnly: true
    },
    
]
