# Store Structure

TMX utilizes [Redux](https://redux.js.org/) for state management and [Immer's Produce Method](https://immerjs.github.io/immer/docs/produce) to manage immutability within the Redux store. 

Each TMX **Reducer** consumes and combines objects containing dispatch types (attributes) and associated methods which are exported by **Producers**.

    const producerArray = [
        xyzProducer,
        ...
    ];
    
    const producers = Object.assign({}, ...producerArray);

Dispatch types are referred to as "handlers". Instead of using switch statements, TMX Reducers check the keys of the producer objects to see if they contain a known dispatch type; if not, existing state is returned.

    const createReducer = handlers => (state=initialState, action) => {
        if (!Object.keys(handlers).includes(action.type)) { return state; }
        return handlers[action.type](state, action);
    };
    
    export default createReducer(producers);
    
The goal of this structure is to organize methods into logical groupings and control module size. Some producers, such as the drawProducer, break their methods into smaller sub-producers following this same structure.