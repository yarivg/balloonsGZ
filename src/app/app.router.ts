import { Route } from '@angular/router'
import { CameraOpenerComponent } from './cameraOpener/cameraOpener.component'
import { UploadReportComponent } from './uploadReport/uploadReport.component'

export const routes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'cam'},
    { component: CameraOpenerComponent, path: 'cam' },
    { component: UploadReportComponent, path: 'upload' }
]