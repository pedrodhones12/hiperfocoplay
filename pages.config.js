**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import CharacterCreator from './pages/CharacterCreator';
import ConnectWorld from './pages/ConnectWorld';
import CreateProject from './pages/CreateProject';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import GamePlay from './pages/GamePlay';
import GamePlayEducational from './pages/GamePlayEducational';
import Games from './pages/Games';
import Home from './pages/Home';
import HyperfocusTest from './pages/HyperfocusTest';
import LearningPathView from './pages/LearningPathView';
import LearningPaths from './pages/LearningPaths';
import MyProjects from './pages/MyProjects';
import Onboarding from './pages/Onboarding';
import OurStory from './pages/OurStory';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import PublicProfile from './pages/PublicProfile';
import Settings from './pages/Settings';
import ErasJourney from './pages/ErasJourney';
import EraView from './pages/EraView';
import MissionPlay from './pages/MissionPlay';
import __Layout from './Layout.jsx';


export const PAGES = {
    "CharacterCreator": CharacterCreator,
    "ConnectWorld": ConnectWorld,
    "CreateProject": CreateProject,
    "Dashboard": Dashboard,
    "Feed": Feed,
    "GamePlay": GamePlay,
    "GamePlayEducational": GamePlayEducational,
    "Games": Games,
    "Home": Home,
    "HyperfocusTest": HyperfocusTest,
    "LearningPathView": LearningPathView,
    "LearningPaths": LearningPaths,
    "MyProjects": MyProjects,
    "Onboarding": Onboarding,
    "OurStory": OurStory,
    "PostJob": PostJob,
    "Profile": Profile,
    "Progress": Progress,
    "PublicProfile": PublicProfile,
    "Settings": Settings,
    "ErasJourney": ErasJourney,
    "EraView": EraView,
    "MissionPlay": MissionPlay,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};
