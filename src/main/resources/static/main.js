$(async function () {
    await getTableWithUsers();
    getNewUserForm();
    getDefaultModal();
    addNewUser();
    getTableUserNowAdmin();
    getTableUserNow();
})

const userFetchService = {
    head: {
        'Content-Type': 'application/json'
    },
    findAllUsers: async () => await fetch('api/admin'),
    findAllRoles: async () => await fetch('api/admin/roles'),
    findUserNow: async () => await fetch('api/admin/userNow'),
    findOneUser: async (id) => await fetch(`api/admin/${id}`),
    addNewUser: async (user) => await fetch('api/admin', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user) => await fetch('api/admin', {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/admin/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.password}</td>
                            <td>${user.roles.map(x => x.name)} </td>       
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-primary" 
                                data-toggle="modal" data-target="#DefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#DefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#tbody").find('button').on('click', (event) => {
        let defaultModal = $('#DefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}


async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}

async function getDefaultModal() {
    $('#DefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


async function editUser(modal, id) {

    modal.find('.modal-title').html('Edit user');

    Promise.all([
        (await userFetchService.findOneUser(id)).json(),
        (await userFetchService.findAllRoles()).json()
    ])
        .then(user => {
            let bodyForm = `
            <form class="form-group" id="editUser">
                <label for="id">Id</label>
                <input type="text" class="form-control" id="id" name="id" value="${user[0].id}" disabled><br>
                <label for="username">Username</label>
                <input class="form-control" type="text" id="username" value="${user[0].username}"><br>
                <label for="id">Password</label>
                <input class="form-control" type="password" id="password" value="${user[0].password}"><br> 
                <label for="roles">Role</label>
                <select multiple class="form-control"  id="roles" ><br>
                    <option id="sel" value="id: ${user[1][0].id},name: ${user[1][0].name},authority: ${user[1][0].authority}">ADMIN</option>
                    <option id="sel1" value="id: ${user[1][1].id},name: ${user[1][1].name},authority: ${user[1][1].authority}">USER</option>
                </select>  
            </form>
        `;
            modal.find('.modal-body').append(bodyForm);
        })

    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let username = modal.find("#username").val().trim();
        let password = modal.find("#password").val().trim();
        let sel = modal.find("#roles").val();
        const roles = sel.map(str => {
            return str.split(',').reduce((acc, val) => {
                const [key, value] = val.split(':').map(item => item.trim());
                acc[key] = value;
                return acc;
            }, {});
        });
        const data = {
            id: id,
            username: username,
            password: password,
            authorities: roles,
        };
        const response = await userFetchService.updateUser(data);
        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    modal.find('.modal-title').html('Delete user');
    Promise.all([
        (await userFetchService.findOneUser(id)).json(),
        (await userFetchService.findAllRoles()).json()
    ])
        .then(user => {
            let bodyForm = `
            <form class="form-group" id="editUser">
                <label for="id">Id</label>
                <input type="text" class="form-control" id="id" name="id" value="${user[0].id}" disabled><br>
                <label for="username">Username</label>
                <input class="form-control" type="text" id="username" value="${user[0].username}" disabled><br>
                <label for="id">Password</label>
                <input class="form-control" type="password" id="password" value="${user[0].password}" disabled><br> 
                <label for="roles">Role</label>
                <select multiple class="form-control"  id="roles"  disabled><br>
                    <option id="sel" value="">ADMIN</option>
                    <option id="sel1" value="">USER</option>
                </select>  
            </form>
        `;
            modal.find('.modal-body').append(bodyForm);
        })
    let editButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    $("#deleteButton").on('click', async () => {

        let id = modal.find("#id").val().trim();
        const response = await userFetchService.deleteUser(id);
        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            <label for="error">Cannot delete!!!</label>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}


async function addNewUser() {
    const myForm = document.querySelector(".myForm");
    let newUser = "";
    await userFetchService.findAllRoles()
        .then((res) => res.json())
        .then((roles) => {
            return (newUser = `
            <form class="form-group" id="newUser">                
                <label for="AddNewUserLogin">Email</label>
                <input class="form-control" type="text" id="AddNewUserLogin" ><br>
                <label for="AddNewUserPassword">Password</label>
                <input class="form-control" type="password" id="AddNewUserPassword" ><br> 
                <label for="AddNewUserRole">Role</label>
                <div class="form-group">
                <select multiple class="form-control" id="AddNewUserRole" ><br>
                    <option id="sel3" value="id: ${roles[0].id},name: ${roles[0].name},authority: ${roles[0].authority}">ADMIN</option>
                    <option id="sel4" value="id: ${roles[1].id},name: ${roles[1].name},authority: ${roles[1].authority}">USER</option>
                </select>  
                </div>
                <button type="button" class="btn btn-primary" id="addNewUserButton">Add new User</button>    
            </form>`);
        })
    myForm.innerHTML = newUser;

    $('#addNewUserButton').click(async () => {
        let addUserForm = $('.myForm')
        let username = addUserForm.find('#AddNewUserLogin').val().trim();
        let password = addUserForm.find('#AddNewUserPassword').val().trim();
        let role = addUserForm.find('#AddNewUserRole').val();
        const roles = role.map(str => {
            return str.split(',').reduce((acc, val) => {
                const [key, value] = val.split(':').map(item => item.trim());
                acc[key] = value;
                return acc;
            }, {});
        });
        let data = {
            username: username,
            password: password,
            authorities: roles,
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await getTableWithUsers();
            addUserForm.find('#AddNewUserLogin').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#AddNewUserRole').val('');
            window.location.replace("http://localhost:8080/admin");
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}

async function getTableUserNowAdmin() {
    let table = $('#tbody2');
    table.empty();

    await userFetchService.findUserNow()
        .then(res => res.json())
        .then(user => {
            let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.password}</td>
                            <td>${user.roles.map(x => x.name)} </td>
                        </tr>
                )`;
            table.append(tableFilling);
        })
}

async function getTableUserNow() {
    let table = $('#tbody3');
    table.empty();

    await userFetchService.findUserNow()
        .then(res => res.json())
        .then(user => {
            let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.password}</td>
                            <td>${user.roles.map(x => x.name)} </td>
                        </tr>
                )`;
            table.append(tableFilling);
        })
}