
const pickValidFields = (queryObj: Record<string, unknown>, keys: string[]) => {
    const validFieldsObject: Record<string, unknown> = {};
    const queryObjArray = Object.keys(queryObj);
  
    if (queryObjArray.length > 0) {
      queryObjArray.forEach((key) => {
        if (keys.includes(key) && queryObj[key]) {
          validFieldsObject[key] = queryObj[key];
        }
      });
    }
  
    return validFieldsObject;
  };
  
  export default pickValidFields;