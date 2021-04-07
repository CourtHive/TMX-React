(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{81:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return l}));var a=n(3),i=n(7),r=(n(0),n(99)),o={title:"TMX Architecture",slug:"/architecture"},s={unversionedId:"architecture",id:"architecture",isDocsHomePage:!1,title:"TMX Architecture",description:"TMX stands for eXtensible Tournament Management. The initial goal for TMX was to be able to rapidly leverage existing systems with data relevant to running tennis tournaments (including tournament calendars, rank lists, ratings and registered players); to manage the running of tournaments, including the real-time publishing of draws, statistics and results; and to produce document-based time capsules of all the data that was required to run tournaments, with the ability to export results in multiple formats.",source:"@site/docs/architecture.md",slug:"/architecture",permalink:"/TMX/docs/architecture",version:"current",sidebar:"docs",previous:{title:"Getting Started",permalink:"/TMX/docs/"},next:{title:"CourtHive Challenge",permalink:"/TMX/docs/challenge"}},c=[{value:"IndexedDB",id:"indexeddb",children:[]},{value:"socket.io",id:"socketio",children:[]},{value:"UI Framework",id:"ui-framework",children:[]},{value:"Initialization and Configuration",id:"initialization-and-configuration",children:[{value:"defaults.js",id:"defaultsjs",children:[]},{value:"context.js",id:"contextjs",children:[]},{value:"development mode",id:"development-mode",children:[]},{value:"Tennis Open Data Standard (TODS)",id:"tennis-open-data-standard-tods",children:[]},{value:"Engines",id:"engines",children:[]},{value:"Engines Add Context",id:"engines-add-context",children:[]},{value:"Engines and Redux",id:"engines-and-redux",children:[]},{value:"Redux Store",id:"redux-store",children:[]}]}],d={toc:c};function l(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(r.b)("wrapper",Object(a.a)({},d,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"TMX stands for ",Object(r.b)("em",{parentName:"p"},"eXtensible Tournament Management"),". The initial goal for TMX was to be able to rapidly leverage existing systems with data relevant to running tennis tournaments (including tournament calendars, rank lists, ratings and registered players); to manage the running of tournaments, including the real-time publishing of draws, statistics and results; and to produce document-based time capsules of all the data that was required to run tournaments, with the ability to export results in multiple formats."),Object(r.b)("p",null,"TMX is built as a ",Object(r.b)("strong",{parentName:"p"},Object(r.b)("em",{parentName:"strong"},"Progressive Web Application")),', able to run in "offline" mode at venues where there is no internet connection or where reliable connectivitity is an issue. Tournament Directors are insulated from internet outages, and perforrmance is far superior to online-only applications.'),Object(r.b)("p",null,"While data can be imported into TMX by drag and drop or loading of local files, in normal use TMX connects to a ",Object(r.b)("strong",{parentName:"p"},Object(r.b)("em",{parentName:"strong"},"CourtHive Server"))," to retrieve tournament records and player lists and to save permanent copies of tournament records."),Object(r.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(r.b)("div",{parentName:"div",className:"admonition-heading"},Object(r.b)("h5",{parentName:"div"},Object(r.b)("span",{parentName:"h5",className:"admonition-icon"},Object(r.b)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},Object(r.b)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),Object(r.b)("div",{parentName:"div",className:"admonition-content"},Object(r.b)("p",{parentName:"div"},"The initial release of TMX 2.0 has server integration disabled as the 2.0 server is in the process of being re-architected."))),Object(r.b)("h2",{id:"indexeddb"},Object(r.b)("a",{parentName:"h2",href:"https://www.w3.org/TR/IndexedDB/"},"IndexedDB")),Object(r.b)("p",null,"TMX makes use of ",Object(r.b)("a",{parentName:"p",href:"https://javascript.info/indexeddb"},"IndexedDB")," via ",Object(r.b)("a",{parentName:"p",href:"https://dexie.org/"},"Dexie")," to store ",Object(r.b)("em",{parentName:"p"},"Tournament Records")," and ",Object(r.b)("em",{parentName:"p"},"Settings")," locally."),Object(r.b)("h2",{id:"socketio"},Object(r.b)("a",{parentName:"h2",href:"https://socket.io/"},"socket.io")),Object(r.b)("p",null,"TMX connects to a ",Object(r.b)("strong",{parentName:"p"},Object(r.b)("em",{parentName:"strong"},"CourtHive Server"))," primarily via ",Object(r.b)("strong",{parentName:"p"},Object(r.b)("a",{parentName:"strong",href:"https://socket.io"},"socket.io")),"; this ",Object(r.b)("a",{parentName:"p",href:"https://javascript.info/websocket"},"webSocket"),' based connection enables TMX to listen for messages targeted to specific users or relavant to the tournament that is being managed. This communication channel is used to coordinate actions across multiple instances of TMX that are being used to run the same tournament, and to receive, for instance, live scoring information for matches which have been delegated to "trackers" which may be used by Chair Umpires or "roaming referees".'),Object(r.b)("h2",{id:"ui-framework"},"UI Framework"),Object(r.b)("p",null,"The UI components of TMX are developed with ",Object(r.b)("a",{parentName:"p",href:"https://reactjs.org/"},"React")," and ",Object(r.b)("a",{parentName:"p",href:"https://material-ui.com/"},"Material-UI"),", utilizing ",Object(r.b)("a",{parentName:"p",href:"https://redux.js.org/"},"Redux")," with ",Object(r.b)("a",{parentName:"p",href:"https://immerjs.github.io/immer/docs/introduction"},"Immer")," for state management. The build process for TMX is ",Object(r.b)("a",{parentName:"p",href:"https://reactjs.org/docs/create-a-new-react-app.html"},"create-react-app"),"."),Object(r.b)("hr",null),Object(r.b)("h2",{id:"initialization-and-configuration"},"Initialization and Configuration"),Object(r.b)("p",null,'TMX was designed to be configurable on the fly using a system of "keys", which are JSON objects delivered to the client via ',Object(r.b)("em",{parentName:"p"},"socket.io"),"; they are used to deliver language files, authorization tokens, and to change the behavior of the client by enabling or disabling functionality, typically based on the policies different organizations wish to enforce while tournaments are being run."),Object(r.b)("p",null,"When TMX is initially launched the startup procedure is as follows:"),Object(r.b)("ol",null,Object(r.b)("li",{parentName:"ol"},"Gather context information including device details; parse query string; add window event listners for orientation changes, browser resize, error trapping and context menus"),Object(r.b)("li",{parentName:"ol"},"Initialize socket.io and connection to CourtHive Server"),Object(r.b)("li",{parentName:"ol"},"Initialize IndexedDb; initialize EventEmitter and related listeners"),Object(r.b)("li",{parentName:"ol"},"Request updated list of available idioms from CourtHive Server; update lanugage bindings if necessaary"),Object(r.b)("li",{parentName:"ol"},"Perform any tasks required by configuration, directives, or queryString values"),Object(r.b)("li",{parentName:"ol"},"Check whether TMX is running in development mode and if so set window.dev object"),Object(r.b)("li",{parentName:"ol"},"Initialize Redux store values relevant to configured state")),Object(r.b)("h3",{id:"defaultsjs"},"defaults.js"),Object(r.b)("p",null,"The default configuration for TMX is found in ",Object(r.b)("inlineCode",{parentName:"p"},"'config/defaults.js'"),". This file may be modified during the build process. When keys are loaded they are stored in ",Object(r.b)("strong",{parentName:"p"},"IndexedDB")," and the settings they specify override the values in ",Object(r.b)("inlineCode",{parentName:"p"},"'defaults.js'")),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"'config/defaults.js'")," is imported as ",Object(r.b)("inlineCode",{parentName:"p"},"'env'")," in modules where configuration values are required"),Object(r.b)("h3",{id:"contextjs"},"context.js"),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"'context.js'")," is somewhat of a legacy store, used in a similar way to ",Object(r.b)("inlineCode",{parentName:"p"},"'defaults.js'"),", but it contains information relevant to the current context, including authorization status, information about any queryString that was used to launch TMX, and an EventEmitter that is slowly being phased out."),Object(r.b)("h3",{id:"development-mode"},"development mode"),Object(r.b)("p",null,"When TMX is launched via ",Object(r.b)("inlineCode",{parentName:"p"},"yarn start")," and is running on ",Object(r.b)("inlineCode",{parentName:"p"},"localhost")," a ",Object(r.b)("inlineCode",{parentName:"p"},"dev")," object is available in the browser console which can be used to access functional modules which have been added to the dev context, including the ",Object(r.b)("strong",{parentName:"p"},"Redux")," store."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-js"},"dev.env;\ndev.tmxStore.getState().tmx.records;\n")),Object(r.b)("hr",null),Object(r.b)("h3",{id:"tennis-open-data-standard-tods"},Object(r.b)("a",{parentName:"h3",href:"https://itftennis.atlassian.net/wiki/spaces/TODS/overview"},"Tennis Open Data Standard (TODS)")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"TODS")," is defined by the ",Object(r.b)("a",{parentName:"p",href:"https://www.itftennis.com/en/"},"ITF")," to facilitate the exchange of tennis-related data and to enable an ecosystem of services based on tennis data. TODS can be implemented in either XML or JSON. The ",Object(r.b)("a",{parentName:"p",href:"https://www.worldtennisnumber.com/"},"World Tennis Number")," is one of the first services provided by the ITF which is based on TODS."),Object(r.b)("p",null,"TMX uses a JSON implementation of TODS internally to represent tournaments, and can create, load, receive, mutate, save and send tournament records. As used by TMX, TODS provides a document which can contain all the information necessary to run a tournament, or a time-capsule of all the data which was used to run a tournament. This document-based view means that external database calls are not necessary."),Object(r.b)("p",null,"Every update operation performed by TMX is a mutation of a JSON-based tournament record."),Object(r.b)("p",null,"The CourtHive Server handles any external integrations/connectivity that is required to import additional information into tournament records."),Object(r.b)("h3",{id:"engines"},"Engines"),Object(r.b)("p",null,"In TMX, changes to tournament records are performed exclusively by ",Object(r.b)("strong",{parentName:"p"},"Engines")," which are provided by the ",Object(r.b)("a",{parentName:"p",href:"https://courthive.github.io/tods-competition-factory/"},"Competition Factory"),". These engines insure the integrity of tournament records and do not allow changes to the underlying JSON objects which would create invalid data or structures. ",Object(r.b)("strong",{parentName:"p"},"Tournament Records should never be modified directly!")),Object(r.b)("p",null,"The Competition Factory Engines are:"),Object(r.b)("ol",null,Object(r.b)("li",{parentName:"ol"},"Competition Engine - operations which span tournaments, such as scheduling"),Object(r.b)("li",{parentName:"ol"},"Tournament Engine - modify tournament attributes, add/delete participants or events"),Object(r.b)("li",{parentName:"ol"},"Draw Engine - core logic for creating and manipulaing draws including scoring")),Object(r.b)("p",null,"Every engine has the same architecture. A core module provides default methods, such as loading documents to set state, and imports methods from ",Object(r.b)("strong",{parentName:"p"},"governors")," which oversee different aspects of document mutation. Engines pass state and any data transformations made by middleware along to methods provided by governors."),Object(r.b)("h3",{id:"engines-add-context"},"Engines Add Context"),Object(r.b)("p",null,"When information is accessed via an engine, context is typically added to the requested information. A ",Object(r.b)("strong",{parentName:"p"},"matchUp")," in TODS does not contain information about the objects within which it is embedded; for instance, a ",Object(r.b)("strong",{parentName:"p"},"matchUp")," exists within a ",Object(r.b)("strong",{parentName:"p"},"structure")," which is embedded within a ",Object(r.b)("strong",{parentName:"p"},"drawDefinition"),", which is embeded within an ",Object(r.b)("strong",{parentName:"p"},"event"),", which is embeddeed within a ",Object(r.b)("strong",{parentName:"p"},"tournament"),". When a ",Object(r.b)("strong",{parentName:"p"},"matchUp")," is displayed in a user interface context information is often required, such as ",Object(r.b)("inlineCode",{parentName:"p"},"eventName"),"."),Object(r.b)("p",null,"To access information:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-js"},"import { useSelector } from 'react-redux';\nimport { competitionEngine } from 'engines/comptitionEngine';\n\nfunction() {\n  const tournamentRecords = useSelector(state => state.tmx.records)\n  competitionEngine.setState(tournamentRecords);\n  const { matchUps } = competitionEngine.allCompetitionMatchUps();\n}\n")),Object(r.b)("h3",{id:"engines-and-redux"},"Engines and Redux"),Object(r.b)("p",null,"All mutations to tournament records must be made using the engines. Additionally, all engine methods which result in a mutation must be called via the ",Object(r.b)("strong",{parentName:"p"},"dispatch")," method of the Redux store."),Object(r.b)("p",null,"To update information:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-js"},"...\n\n  dispatch({\n    type: 'competitionEngine',\n    payload: {\n      methods: [\n        { method: 'methodName', params: {} }\n      ]\n    }\n  });\n\n...\n")),Object(r.b)("p",null,"The dispatch types ",Object(r.b)("inlineCode",{parentName:"p"},"competitionEngine")," and ",Object(r.b)("inlineCode",{parentName:"p"},"tournamentEngine")," must be used to invoke ",Object(r.b)("strong",{parentName:"p"},"ALL")," engine mutation methods. There are three downstream effects to successfully invoking an engine method via the store:"),Object(r.b)("ol",null,Object(r.b)("li",{parentName:"ol"},"Updating the store triggers updates in the UI"),Object(r.b)("li",{parentName:"ol"},"Updating the store triggers a local save of the tournament record to IndexedDB"),Object(r.b)("li",{parentName:"ol"},"Updating the store sends (or queues) a message to the CourtHive Server")),Object(r.b)("p",null,"Engine mutation methods should be designed to accept the minimum information required to effect the desired mutation. This is because the attributes of each dispatch are intended to serve as a transactional history from which tournament state can be recreated, and because the messages sent to the CourtHive Server are broadcast to other instances of TMX which are operating on the same tournament record(s) to keep them in sync."),Object(r.b)("h3",{id:"redux-store"},"Redux Store"),Object(r.b)("p",null,"TMX defines a design pattern which makes use of ",Object(r.b)("a",{parentName:"p",href:"https://immerjs.github.io/immer/docs/introduction"},"Immer"),' to modify the Redux Store. The core Reducer aggregates Immer "Producers" and catches errors (when not in dev mode) enabling any client-side errors to be sent to the CourtHive Server for proactive analysis / debugging.'))}l.isMDXComponent=!0}}]);