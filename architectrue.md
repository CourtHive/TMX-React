# TMX Architecture
TMX stands for *eXtensible Tournament Management*.  The initial goal for TMX was to be able to rapidly leverage existing systems with data relevant to running tennis tournaments (including tournament calendars, rank lists, ratings and registered players); to manage the running of tournaments, including the real-time publishing of draws, statistics and results; and to produce document-based time capsules of all the data that was required to run tournaments, with the ability to export results in multiple formats.

TMX is built as a ***Progressive Web Application***, able to run in "offline" mode at venues where there is no internet connection or where reliable connectivitity is an issue.  Tournament Directors are insulated from internet outages, and perforrmance is far superior to online-only applications.

While data can be imported into TMX by drag and drop or loading of local files, in normal use TMX connects to a ***CourtHive Server*** to retrieve tournament records and player lists and to save permanent copies of tournament records.  

### [IndexedDB](https://www.w3.org/TR/IndexedDB/)
TMX makes use of [IndexedDB](https://javascript.info/indexeddb) via [Dexie](https://dexie.org/) to store *Tournament Records* and *Settings* locally.

### [socket.io](https://socket.io/)
TMX connects to a *CourtHive Server* primarily via **[socket.io](https://socket.io)**; this [webSocket](https://javascript.info/websocket) based connection enables TMX to listen for messages targeted to specific users or relavant to the tournament that is being managed.  This communication channel is used to coordinate actions across multiple instances of TMX that are being used to run the same tournament, and to receive, for instance, live scoring information for matches which have been delegated to "trackers" which may be used by Chair Umpires or "roaming referees".

### UI Framework
The UI components of TMX are developed with [React](https://reactjs.org/) and [Material-UI](https://material-ui.com/), utilizing [Redux](https://redux.js.org/) with [Immer](https://immerjs.github.io/immer/docs/introduction) for state management.  The build process for TMX is [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html).

*****

## Initialization and Configuration
TMX was designed to be configurable on the fly using a system of "keys", which are JSON objects delivered to the client via *socket.io*; they are used to deliver language files, authorization tokens, and to change the behavior of the client by enabling or disabling functionality, typically based on the policies different organizations wish to enforce while tournaments are being run.

When TMX is initially launched the startup procedure is as follows:

1. Gather context information including device details; parse query string; add window event listners for orientation changes, browser resize, error trapping and context menus
2. Initialize socket.io and connection to CourtHive Server
3. Initialize IndexedDb; initialize EventEmitter and related listeners
4. Request updated list of available idioms from CourtHive Server; update lanugage bindings if necessaary
5. Perform any tasks required by configuration, directives, or queryString values
6. Check whether TMX is running in development mode and if so set window.dev object
7. Initialize Redux store values relevant to configured state

##### defaults.js
The default configuration for TMX is found in `'config/defaults.js'`. This file may be modified during the build process.  When keys are loaded they are stored in **IndexedDB** and the settings they specify override the values in `'defaults.js'`

 `'config/defaults.js'` is imported as `'env'` in modules where configuration values are required

##### context.js
`'context.js'` is somewhat of a legacy store, used in a similar way to `'defaults.js'`, but it contains information relevant to the current context, including authorization status, information about any queryString that was used to launch TMX, and an EventEmitter that is slowly being phased out.

##### development mode
When TMX is launched via `npm start` and is running on `localhost:3000` (or any localhost port starting with '3') a `dev` object is available in the browser console which can be used to access functional modules which have been added to the dev context, including the **Redux** store.

```
dev.env
dev.tmxStore.getState().tmx.records
```

*****

### [Tennis Open Data Standard (TODS)](https://itftennis.atlassian.net/wiki/spaces/TODS/overview)
**TODS** is defined by the [ITF](https://www.itftennis.com/en/) to facilitate the exchange of tennis-related data and to enable an ecosystem of services based on tennis data. TODS can be implemented in either XML or JSON. The [World Tennis Number](https://www.worldtennisnumber.com/) is one of the first services provided by the ITF which is based on TODS. 

TMX uses a JSON implementation of TODS internally to represent tournaments, and can create, load, receive, mutate, save and send tournament records.  As used by TMX, TODS provides a document which can contain all the information necessary to run a tournament, or a time-capsule of all the data which was used to run a tournament. This document-based view means that external database calls are not necessary.  

Every update operation performed by TMX is a mutation of a JSON-based tournament record.

The CourtHive Server handles any external integrations/connectivity that is required to import additional information into tournament records.

### Engines
In TMX, changes to tournament records are performed exclusively by **Engines**.  These engines insure the integrity of tournament records and do not allow changes to the underlying JSON objects which would create invalid data or structures. **Tournament Records should never be modified directly!**

The TMX Engines are:

1. Competition Engine - operations which span tournaments, such as scheduling
2. Tournament Engine - modify tournament attributes, add/delete participants or events
3. Draw Engine - core logic for creating and manipulaing draws including scoring
4. PDF Engine - generate PDFs
5. Policy Engine - enforce policies by constraining what actions engines can perform
6. Audit Engine - manage an audit trail

Every engine has the same architecture.  A core module provides default methods, such as loading documents to set state, and imports methods from **governors** which oversee different aspects of document mutation.  Engines pass state and any data transformations made by middleware along to methods provided by governors.

##### Engines Add Context
When information is accessed via an engine, context is typically added to the requested information. A **matchUp** in TODS does not contain information about the objects within which it is embedded; for instance, a **matchUp** exists within a **structure** which is embedded within a **drawDefinition**, which is embeded within an **event**, which is embeddeed within a **tournament**. When a **matchUp** is displayed in a user interface context information is often required, such as `eventName`.

To access information:
```
import { useSelector } from 'react-redux';
import { competitionEngine } from 'engines/comptitionEngine';

function() {
  const tournamentRecords = useSelector(state => state.tmx.records)
  competitionEngine.setState(tournamentRecords);
  const { matchUps } = competitionEngine.allCompetitionMatchUps();
}
```

##### Engines and Redux
All mutations to tournament records must be made using the engines.  Additionally, all engine methods which result in a mutation must be called via the **dispatch** method of the Redux store.  

To update information:
```
...

  dispatch({
    type: 'competitionEngine',
    payload: {
      methods: [
        { method: 'methodName', params: {} }
      ]
    }
  });

...
```

The dispatch types `competitionEngine` and `tournamentEngine` must be used to invoke **ALL** engine mutation methods.  There are three downstream effects to successfully invoking an engine method via the store:

1. Updating the store triggers updates in the UI
2. Updating the store triggers a local save of the tournament record to IndexedDB
3. Updating the store sends (or queues) a message to the CourtHive Server

Engine mutation methods should be designed to accept the minimum information required to effect the desired mutation.  This is because the attributes of each dispatch are intended to serve as a transactional history from which tournament state can be recreated, and because the messages sent to the CourtHive Server are broadcast to other instances of TMX which are operating on the same tournament record(s) to keep them in sync.

### Redux Store

TMX defines a design pattern which makes use of [Immer](https://immerjs.github.io/immer/docs/introduction) to modify the Redux Store. The core Reducer aggregates Immer "Producers" and catches errors (when not in dev mode) enabling any client-side errors to be sent to the CourtHive Server for proactive analysis / debugging.

### Testing

The TMX development environment makes extensive use of [Jest](https://jestjs.io/) for unit testing and [Cypress](https://www.cypress.io/) for end-to-end testing.

To run all Jest tests: `npm test`
To run all Cypress tests: `cypress run`

Cypress may also be run interactively: `cypress open`
