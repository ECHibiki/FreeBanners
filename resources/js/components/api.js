import axios from 'axios';
import { sha256 } from 'js-sha256'
import Cookies from 'js-cookie';

var host_addr = "http://localhost:8000";

export class APICalls{
	static hashPass(name, pass){
		var fake_salt_pass = name + "V" + pass;
		if(name == undefined || pass == undefined || fake_salt_pass == undefined){
			console.log("HASHPASS UNDEFINED VARIABLE");
			return false;
		}
		var hash = sha256(fake_salt_pass);
		return hash;
	}
	
	static callCreate(name, pass){
		var post_data = {"name":name, "pass":pass};
		return axios.post(host_addr + '/api/create', post_data, {headers:
			{
				"accept":"application/json", "content-type":"application/json"
			}
			})
			.then(function(res){
				return res.data;
			})
			.catch(function(err){
				console.log(err);
				return "4xx";
			});
	}
	static callSignIn(name, pass){
		var post_data = {"name":name, "pass":pass};
		return axios.post(host_addr + '/api/login', post_data, {headers:
			{
				"accept":"application/json", "content-type":"application/json"
			}
			})
			.then(function(res){
				return res.data;
			})
			.catch(function(err){
				console.log(err);
				return err.status;
			});
	}
	static callCreateNewAd(imagefile, url){
		var post_data = {"image":imagefile};
		return axios.post(host_addr + '/api/details', post_data, {headers:
			{
				"accept":"application/json", "content-type":"multipart/form-data", 
				"authorization": "bearer " + InMemoryLocalStore.getAuthToken()
			}
			})
			.then(function(res){
				return res.data;
			})
			.catch(function(err){
				if(err.response == undefined){
					return {"message":"404", "error":{"server":"Server 404"}}
				}
				return err.response.data;
			});

	}
	static callRetrieveUserAds(){
		return axios.get(host_addr + '/api/details', {headers:
			{
				"accept":"application/json", 
				"authorization": "bearer " + InMemoryLocalStore.getAuthToken()
			}
			})
			.then(function(res){
				return res.data;
			})
			.catch(function(err){
				if(err.response == undefined){
					return {"message":"404", "error":{"server":"Server 404"}}
				}
				return err.response.data;
			});

	}
	static callRemoveUserAds(uri, url){
		var post_data = {"uri":uri, "url":url};
		return axios.post(host_addr + '/api/removal', post_data, {headers:
			{
				"accept":"application/json", 
				"authorization": "bearer " + InMemoryLocalStore.getAuthToken()
			}
			})
			.then(function(res){
				return res.data;
			})
			.catch(function(err){
				if(err.response == undefined){
					return {"message":"404", "error":{"server":"Server 404"}}
				}
				return err.response.data;
			});

	}	
}

export class InMemoryLocalStore{
	static getAuthToken(){
		if(Cookies.get("freeadstoken") != undefined && this.token == undefined){
			this.token = Cookies.get("freeadstoken");
		}
		return this.token;
	}
	static storeAuthToken(token){
		this.token = token;
		if(this.token != undefined){
			Cookies.set("freeadstoken", token)
		}
	}
}
