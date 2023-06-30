// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  app?: any;
  products?: any;
  auth?: any;
  orders?: any;
  updateUser?: any;
  users?: any;
  cms?: any;
  instances?: any;
  security?: any;
}
