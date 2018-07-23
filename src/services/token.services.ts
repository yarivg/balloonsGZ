import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { resolve } from 'url';

@Injectable()
export class TokenService {
    private val: string = '11'

    private _window: any

    constructor(private http: HttpClient, private router: Router) {
        this._window = window
    }

    public checkAuth() {

        let splitString = window.location.href.split('entry=')

        if (splitString.length > 1 && ['undefined', '', null, undefined].includes(localStorage.getItem('userToken'))) {
            if (splitString[1] === 'reporter') {
                let options = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    })
                }
                let body = {
                    'phone': '9725370946'
                }
                this.http.post(`/api/token`, body, options).subscribe( data => {
                    let splitString = data['url'].split('entry=')
                    if (splitString.length > 1 && ['undefined', '', null, undefined].includes(localStorage.getItem('userToken'))) {
                        localStorage.setItem('userToken', splitString[1])
                    }
                    // alert("עובדים על זה. תודה.")
                    console.log("sending")

                    // this.router.navigate(['/map']);
                }, error => {
                    // alert("אנחנו על זה.")
                    console.log(error)
                    // this.router.navigate(['/map']);
                });
            }
            else {
                localStorage.setItem('userToken', splitString[1])
            }
        }
    }

}
