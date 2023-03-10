import React from 'react';
import { createBrowserRouter }  from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Dashboard } from './pages/dashboard';
import { Homepage } from './pages/Index';
import {Onboarding} from  './pages/Onboarding/Onboarding'
import { PrivacyPolicy } from './pages/privacy-policy';
import { Results } from './pages/Results/results';
import { TermsCondition } from './pages/terms-condition';

const router = createBrowserRouter([
{
    path: '/signup',
    element: <Signup />
},
{
    path: '/login',
    element: <Login />
},
{
    path: '/onboarding',
    element: <Onboarding />
},
{
    path: '/results/:id',
    element: <Results />
},
{
    path: '/dashboard',
    element: <Dashboard />
},
{
    path: '/',
    element: <Homepage />
},
{
    path: '/privacy-policy',
    element: <PrivacyPolicy />
},
{
    path: '/terms-condition',
    element: <TermsCondition />
},



]);

export { router };