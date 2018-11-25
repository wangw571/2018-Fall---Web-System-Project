
export const loginAlert = "The email or the password is incorrect. PLease try again";
export const queriesAlert = "This query is invalid. Please try again";


class _Alert {

    errProcess = (err) => {
      console.log(err);
      alert(err);
    }
  }
  
  /* Singleton for authentication object */
  let instance;
  export const Alert = {
    getInstance: () => {
      if (!instance) {
        instance = new _Alert();
      }
      return instance
    }
  };