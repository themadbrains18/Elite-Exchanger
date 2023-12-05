export async function postData(url: string = '', data: any = {}, token: string = "") {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-type' : 'application/json',
      'authorization':`${token}`,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)

  });

  let status = response.status
  let responseData = await response.json();
  return {
    status: status,
    data: status === 500 ? responseData.message : responseData
  };
}

export async function postForm(url: string = '', data: any = {}, headers: any = {}) {
  
  const response = await fetch(url, {
    
    method: 'POST',
    headers: headers,
    body: data,
    duplex:'half'

  } as any);

  let status = response.status
  let responseData = await response.json();
  return {
    status: status,
    data: status === 500 ? responseData.message : responseData
  };
}

export async function getData(url: string = '', data: any = {}) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function putData(url = '', data = {}, token = '') {
  const response = await fetch(url, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `${token}`,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function getMethod(url = '', token = '') {
  
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `${token.trim()}`
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });

  
  let status = response.status;
  let res = await response.json()

  
  if (typeof res == "object") {
    return res;
  } else {
    console.log(res, "in error  side")
    return res;
  }
}


export async function deleteMethod(url = '', token = '') {
  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `${token}`,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });

  let responseData = await response.json();
  return responseData;
}


// module.exports ={
//   postData,
//   getData,
//   putData,
//   getMethod,
//   deleteMethod
// }