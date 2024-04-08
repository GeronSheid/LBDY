import { lazy } from "react";
import KnowlegeBase from "./KnowlegeBase";

export const KnowlegeBaseAsync = lazy(() => import('./KnowlegeBase'))
