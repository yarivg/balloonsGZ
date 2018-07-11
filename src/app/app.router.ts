import { Route } from '@angular/router'
import { UploadReportComponent } from './uploadReport/uploadReport.component'
import { CameraOpenerComponent } from './cameraOpener/cameraOpener.component'

export const routes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'cam'},
    { component: CameraOpenerComponent, path: 'cam' },
    { component: UploadReportComponent, path: 'upload' }
]