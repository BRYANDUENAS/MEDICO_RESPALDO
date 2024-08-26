import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { Routess } from "../routes";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import { PrivateRoutes } from '../routes/PrivateRoutes';
import UserPage from './UserPage';
import { Button } from '@themesberg/react-bootstrap';
import '../../src/assets/acordion.css';

const RouteWithLoader = ({ element: Element, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader show={!loaded} />
      <Element {...rest} />
    </>
  );
};

const RouteWithSidebar = ({ element: Element, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true;
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <>
      <Preloader show={loaded ? false : true} />  
      <div className={showSidebar ? "" : "d-none"}>
        <Sidebar showSidebar={showSidebar} />
      </div>   
      <main 
          className={showSidebar ? "content" : "w-100 ps-6 pe-4"}
        >
        <div className="d-flex justify-content-between align-items-center">
          <Button onClick={toggleSidebar} className='button_hamburguer'
          >
            <FontAwesomeIcon icon={faBars} />
          </Button> 
            <Navbar />
        </div>        
          <Element {...rest} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
    </>
  );
};

export default () => (
  <Routes>
    <Route path={Routess.Signin.path} element={<RouteWithLoader element={Signin} />} />
    <Route path={Routess.Signup.path} element={<RouteWithLoader element={Signup} />} />
    <Route path={Routess.ForgotPassword.path} element={<RouteWithLoader element={ForgotPassword} />} />
    <Route path={Routess.ResetPassword.path} element={<RouteWithLoader element={ResetPassword} />} />
    <Route path={Routess.Lock.path} element={<RouteWithLoader element={Lock} />} />
    <Route path={Routess.NotFound.path} element={<RouteWithLoader element={NotFoundPage} />} />
    <Route path={Routess.ServerError.path} element={<RouteWithLoader element={ServerError} />} />

    {/* Rutas privadas */}
    <Route element={<PrivateRoutes />}>
      <Route path={Routess.Presentation.path} element={<RouteWithLoader element={Presentation} />} />
      <Route path={Routess.DashboardOverview.path} element={<RouteWithSidebar element={DashboardOverview} />} />
      <Route path={Routess.Upgrade.path} element={<RouteWithSidebar element={Upgrade} />} />
      <Route path={Routess.Transactions.path} element={<RouteWithSidebar element={Transactions} />} />
      <Route path={Routess.Settings.path} element={<RouteWithSidebar element={Settings} />} />
      <Route path={Routess.BootstrapTables.path} element={<RouteWithSidebar element={BootstrapTables} />} />
      <Route path={Routess.User.path} element={<RouteWithSidebar element={UserPage} />} />
    </Route>

    {/* Components */}
    <Route path={Routess.Accordions.path} element={<RouteWithSidebar element={Accordion} />} />
    <Route path={Routess.Alerts.path} element={<RouteWithSidebar element={Alerts} />} />
    <Route path={Routess.Badges.path} element={<RouteWithSidebar element={Badges} />} />
    <Route path={Routess.Breadcrumbs.path} element={<RouteWithSidebar element={Breadcrumbs} />} />
    <Route path={Routess.Buttons.path} element={<RouteWithSidebar element={Buttons} />} />
    <Route path={Routess.Forms.path} element={<RouteWithSidebar element={Forms} />} />
    <Route path={Routess.Modals.path} element={<RouteWithSidebar element={Modals} />} />
    <Route path={Routess.Navs.path} element={<RouteWithSidebar element={Navs} />} />
    <Route path={Routess.Navbars.path} element={<RouteWithSidebar element={Navbars} />} />
    <Route path={Routess.Pagination.path} element={<RouteWithSidebar element={Pagination} />} />
    <Route path={Routess.Popovers.path} element={<RouteWithSidebar element={Popovers} />} />
    <Route path={Routess.Progress.path} element={<RouteWithSidebar element={Progress} />} />
    <Route path={Routess.Tables.path} element={<RouteWithSidebar element={Tables} />} />
    <Route path={Routess.Tabs.path} element={<RouteWithSidebar element={Tabs} />} />
    <Route path={Routess.Tooltips.path} element={<RouteWithSidebar element={Tooltips} />} />
    <Route path={Routess.Toasts.path} element={<RouteWithSidebar element={Toasts} />} />

    {/* Documentation */}
    <Route path={Routess.DocsOverview.path} element={<RouteWithSidebar element={DocsOverview} />} />
    <Route path={Routess.DocsDownload.path} element={<RouteWithSidebar element={DocsDownload} />} />
    <Route path={Routess.DocsQuickStart.path} element={<RouteWithSidebar element={DocsQuickStart} />} />
    <Route path={Routess.DocsLicense.path} element={<RouteWithSidebar element={DocsLicense} />} />
    <Route path={Routess.DocsFolderStructure.path} element={<RouteWithSidebar element={DocsFolderStructure} />} />
    <Route path={Routess.DocsBuild.path} element={<RouteWithSidebar element={DocsBuild} />} />
    <Route path={Routess.DocsChangelog.path} element={<RouteWithSidebar element={DocsChangelog} />} />

    {/* Redirigir rutas no definidas */}
    <Route path="*" element={<Navigate to={Routess.NotFound.path} />} />
  </Routes>
);
