## drawStructures

**KnockoutStructure.jsx** and **RoundRobinStructure.jsx** wrap display functions and mediate between the actions possible in the rendered draw components and the **drawEngine**

These wrappers define functions for each *event* that is possible in the rendered draws, such as "click" or "contextmenu".

Clicking on a *drawPosition* or a *matchUp* position generates a popover menu with options.  The wrapper defines an array of menuItems it is capable of handling. These menuItems are filtered by an array of actions which the **drawEngine** accepts as valid for the draw position or matchUp given the current state of the draw structure.  The **drawEngine** additionally provides a *payload* which can be used by the function which handle the menuItem to pass on to the *drawEngine* via **redux** `dispatch` methods.  

The **drawEngine** is thus used in two ways:

1. To query / determine what actions are valid for a given *drawPosition* or *matchUp*, and to provide context for taking action
2. To make changes to the **drawDefinition** via **redux**

When changes are made via **redux** then state changes ripple through the application via *useSelector*