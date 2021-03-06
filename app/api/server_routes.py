from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Server, User, Member, server, db
from app.forms import NewServerForm, EditServerForm
from app.socket import handle_add_channel, handle_edit_server, handle_delete_server
from app.aws_upload import (
    upload_file_to_s3, allowed_file, get_unique_filename)
server_routes = Blueprint('servers', __name__)


@server_routes.route('', )
@server_routes.route('/')
@login_required
def servers():
    servers = Server.query.all()
    user_servers = [
        server for server in servers if current_user.id in server.member_ids()]

    return {'servers': [server.to_dict() for server in user_servers]}


@server_routes.route('/', methods=['POST'])
@login_required
def new_server():
    print('in route')
    form = NewServerForm()
    url = "strings"
    print(form.data["private"])
    if not form.data["private"]:
        form['csrf_token'].data = request.cookies['csrf_token']
        if "image_url" not in form.data:
            return {"errors": "image required"}, 400

        image = form.data["image_url"]

        # if not allowed_file(image.filename):
        #     return {"errors": "file type not permitted"}, 400

        image.filename = get_unique_filename(image.filename)

        upload = upload_file_to_s3(image)

        if "url" not in upload:
            return upload, 400

        url = upload["url"]

    if form.data["name"]:
        print('request files', form.data)
        server = Server(
            name=form.data['name'],
            image_url=url,
            private=form.data['private'],
            owner_id=current_user.id
        )
        db.session.add(server)
        db.session.commit()
        member = Member(
            user_id=current_user.id,
            server_id=server.to_dict()['id']
        )
        db.session.add(member)
        db.session.commit()
        handle_add_channel(server.to_dict())
        return server.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@server_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_server(id):
    form = EditServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    server = Server.query.get(int(id))

    url = None

    if 'image_url' in form.data:
        image = form.data["image_url"]

        if not isinstance(image, str) and allowed_file(image.filename) :
            image.filename = get_unique_filename(image.filename)

            upload = upload_file_to_s3(image)
            print('we made it here!!---')

            if "url" not in upload:
                return upload, 400

            url = upload["url"]

    if form.validate_on_submit() and server.owner_id == current_user.id:
        server.name = form.data['name']

        if url:
            server.image_url = url
            
        db.session.commit()
        handle_edit_server(server.to_dict())
        return server.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@server_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_server(id):
    server = Server.query.get(int(id))
    if server.owner_id == current_user.id or server.private:
        handle_delete_server(server.to_dict())
        db.session.delete(server)
        db.session.commit()
        return server.to_dict()


@server_routes.route('/<int:serverId>/members', methods=['POST'])
@login_required
def edit_members(serverId):
    userId = current_user.id
    user = User.query.get(int(userId))
    server = Server.query.get(int(serverId))
    if user and user not in server.members:
        member = Member(
            user_id=userId,
            server_id=serverId
        )
        db.session.add(member)
        db.session.commit()
        return server.to_dict()

    return {'errors': "bad user data"}


@server_routes.route('/<int:serverId>/members/<int:memberId>', methods=['POST'])
@login_required
def add_member(serverId, memberId):
    userId = memberId
    user = User.query.get(int(userId))
    server = Server.query.get(int(serverId))
    if user and user not in server.members:
        member = Member(
            user_id=userId,
            server_id=serverId
        )
        db.session.add(member)
        db.session.commit()
        handle_edit_server(server.to_dict())
        return server.to_dict()

    return {'errors': "bad user data"}


@server_routes.route('/<int:serverId>/members', methods=['DELETE'])
@login_required
def delete_member(serverId):
    userId = current_user.id
    user = User.query.get(int(userId))
    server = Server.query.get(int(serverId))

    if user in server.members:
        member = Member.query.filter(userId == Member.user_id).filter(
            serverId == Member.server_id)[0]
        db.session.delete(member)
        db.session.commit()
        handle_edit_server(server.to_dict())
        return server.to_dict()
    return {"result": "failed"}
