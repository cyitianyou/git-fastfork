$(document).ready(function() {
    $('#token').val(localStorage.githubUserToken)
    $('#orgName').val(localStorage.githubOrganizationName)
    $('#btnUse').off('click').on('click', function() {
        if ($('#token').val() && $('#token').val() !== '') {
            localStorage.githubUserToken = $('#token').val()
        } else {
            alert('token 不能为空!')
        }
        if ($('#orgName').val() && $('#orgName').val() !== '') {
            localStorage.githubOrganizationName = $('#orgName').val()
        }
        if (localStorage.githubUserToken) {
            window.location.href = 'index.html'
        }
    })
})