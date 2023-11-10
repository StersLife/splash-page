import {
  createBrowserRouter,
  Link,
} from "react-router-dom";
import { Button } from "@chakra-ui/react";

import { signOut } from "firebase/auth";

import { ProtectedRoutes } from "./PrivateRoute";
import { auth } from "./../firebase/config";
import { Signup } from './../components/Auth/signup';
import { Login } from './../components/Auth/login';
import { Connections } from "../components/Connection/Connections";
import { ConnectionsLists } from "../components/Connection/ConnectionsLists";



/* import { Connections } from "./Pages/Connections";
import { ConnectionsLists } from "./Pages/ConnectionsLists";
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
        <Button onClick={() => signOut(auth)}>Signout</Button>
      </div>
      </ProtectedRoutes>
    ),
  },
  {
    path: "Connections",
    element:       <ProtectedRoutes>
    <Connections />
    </ProtectedRoutes>
,
},


  {
    path: "Connections/lists",
    element: <ConnectionsLists />,
  },
  {
    path: "/signup",
    element:<Signup />,
  },
  {
    path: "/login",
    element:<Login />,
  },
]);
