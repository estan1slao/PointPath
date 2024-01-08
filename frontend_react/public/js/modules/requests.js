function postData (url, data, onSuccess) {
    fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: data,
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('[POST] Ошибка при ответе с сервера');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('[POST] Ошибка при выполнении функции');
    });
}

function postProjData (url, token, data, onSuccess) {
    fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        body: data,
    },
    )
    .then((response) => {
        if (response.ok) {
            onSuccess();
        } else {
            console.log('[POST] Ошибка при ответе с сервера');
        }
    })
    .catch(() => {
        console.log('[POST] Ошибка при выполнении функции');
    });
}

function getData (url, token, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('[GET] Ошибка при ответе с сервера');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('[GET] Ошибка при выполнении функции');
    });
}

function getListOfData (url, onSuccess) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('[GET] Ошибка при ответе с сервера');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('[GET] Ошибка при выполнении функции');
    });
}

function getCurrentProjData (url, token, onSuccess, onError, role) {
    fetch(url,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )   
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 400) {
            onError(role);
        } else {
            console.log('[GET] Ошибка при ответе с сервера');
        }
    })
    .then((result) => {
        onSuccess(result, role);
    })
    .catch(() => {
        console.log('[GET] Ошибка при выполнении функции');
    });
}

function editData (url, token, data, onSuccess) {
    fetch(url,
    {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        body: data,
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('[PUT] Ошибка при ответе с сервера');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('[PUT] Ошибка при выполнении функции');
    });
}

function changeProjStatus (url, token, onSuccess) {
    fetch(url,
    {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            onSuccess();
        } else {
            console.log('[PUT] Ошибка при ответе с сервера');
        }
    })
    .catch(() => {
        console.log('[PUT] Ошибка при выполнении функции');
    });
}

function deleteProject (url, token, onSuccess) {
    fetch(url,
    {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
    },
    )
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('[DELETE] Ошибка при ответе с сервера');
        }
    })
    .then((result) => {
        onSuccess(result);
    })
    .catch(() => {
        console.log('[DELETE] Ошибка при выполнении функции');
    });
}

function deleteTask(url, token) {
    fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    window.location.reload();
}

function createComment (url, comment, taskID, token) {
    fetch(url, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }, 
        body: JSON.stringify({
            card_id: +taskID,
            content: comment
        }) 
    })
}

export { postData, getData, editData, getCurrentProjData, getListOfData, changeProjStatus, deleteProject, deleteTask, postProjData, createComment };