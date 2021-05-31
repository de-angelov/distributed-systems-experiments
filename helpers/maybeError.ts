type maybeError = <T1, T2>(func: (X:T1) => T2, args: T1) =>  Error | T2
const maybeError: maybeError = (func, args) => {
    try{
        return func(args);
    } catch (er) {
        return new Error(er);
    }
};
   

export { maybeError };