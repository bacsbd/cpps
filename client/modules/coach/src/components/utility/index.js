async function asyncUsernameToUserId(username) {
  const api = `/api/v1/users/username-userId/${username}`;
  try {
    let resp = await fetch(api, {
      credentials: 'same-origin',
    });
    resp = await resp.json();
    if (resp.status !== 200) throw resp;
    return resp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export {asyncUsernameToUserId};
