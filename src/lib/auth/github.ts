import {GitHub} from 'arctic'

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = import.meta.env

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);