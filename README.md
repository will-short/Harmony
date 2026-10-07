# Harmony

A collaborative personal project. The hosted demo is currently unavailable; screenshots and architecture notes are preserved below.


# Harmony overview
Harmony is a full-stack web app using [React](https://reactjs.org/), [React-Redux](https://react-redux.js.org/), [Python/Flask](https://flask.palletsprojects.com/en/2.0.x/) and [PostgreSQL](https://www.postgresql.org/)  

This app is a Discord-inspired app allowing for real-time messaging between users.

Users are able to:
* Create, Read, Update and Delete servers, channels and messages
* Add and remove users as members of servers.
* Direct message other users.

## Splashpage

![Splashpage](https://user-images.githubusercontent.com/16979047/149805389-29563f8e-97d2-40a6-ae74-5b164617e06f.png)

## Server, Channels, Messages and Members

![Main](https://user-images.githubusercontent.com/16979047/149805551-17e65a59-7ad5-465c-a71c-150b9ee11352.png)

## Direct Messages

![DMs](https://user-images.githubusercontent.com/16979047/149805696-a44e91ce-b7f5-44c4-9082-47783a35430b.png)

# Architecture

## Dataflow

<img width="1360" alt="DataFlow" src="https://user-images.githubusercontent.com/16979047/147791919-5b24d739-616a-4e79-aba8-6e74f8785440.png">

## WebSockets

WebSockets allow real-time updates between users. As a team, we connected WebSockets to the Redux state to keep other users' views updated.

<img width="1776" alt="Websockets" src="https://user-images.githubusercontent.com/16979047/149806614-7b1aa096-a153-4430-80a3-e28e61b80a63.png">
