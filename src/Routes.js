import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Loader from './component/Loader/Loader';
import NavMotion from './layout/NavMotion';
import MainLayout from './layout/MainLayout';
import GuestGuard from './component/Auth/GuestGuard';
import AuthGuard from './component/Auth/AuthGuard';
import MinimalLayout from './layout/MinimalLayout';

const AuthLogin = lazy(() => import('./views/Login'));
const DashboardDefault = lazy(() => import('./views/Dashboard/Default'));
const Logout = lazy(() => import('./views/Users/logout'));

const Routes = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Redirect exact from="/" to="/dashboard/default" />
          <Route path={['/application/login']}>
            <MinimalLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <Route path="/application/login" component={AuthLogin} />
                </NavMotion>
              </Switch>
            </MinimalLayout>
          </Route>
          <Route path={['/login']}>
            <MinimalLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <GuestGuard>
                    <Route path="/login" component={AuthLogin} />
                    <Route path="/dashboard/default" component={DashboardDefault} />
                    {/* <Route path="/documents" component={DetailDocument} /> */}
                  </GuestGuard>
                </NavMotion>
              </Switch>
            </MinimalLayout>
          </Route>
          <Route path={['/dashboard/default', '/users/logout']}>
            <MainLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <AuthGuard>
                    <Route path="/dashboard/default" component={DashboardDefault} />
                    <Route path="/users/logout" component={Logout} />
                  </AuthGuard>
                </NavMotion>
              </Switch>
            </MainLayout>
          </Route>
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
};

export default Routes;
