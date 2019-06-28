export function PostData(type, userData) {
    let BaseURL = 'http://localhost:4000/';
    // console.log(BaseURL+type);

    return new Promise((resolve, reject) =>{
        fetch(BaseURL+type, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then((response) => response.json())
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });

  
      });
}