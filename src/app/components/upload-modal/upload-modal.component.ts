import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConstantsService } from '../../services/constants.service';
import { ModalServiceService } from '../../services/modal.service';
import {FileHolder} from 'angular2-image-upload/lib/image-upload/image-upload.component';
import { AddNewServiceService } from '../../services/add-new.service';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent implements OnInit {
  @Output() modalValue = new EventEmitter();
  @Output() imagesToForm = new EventEmitter();
  @Output() inputRequest = new EventEmitter();

  showUpTab: boolean;
  showSelTab: boolean;
  apiURL: string;
  uploadsFilePath: string;
  active = 'tabActive';
  active2 = 'tabInactive';

  NumSelectedImg: number;
  numOfImages: number;
  imageNameCount = 15;
  response: any;
  Imagefiles: any;
  selectedImages = [];
  res: string;
  uploadURL: string;
  inputRequesting: string;


  constructor(
    public modalService: ModalServiceService,
    public addService: AddNewServiceService,
    public constURL: ConstantsService
  ) {
    this.getAllImages();
    this.uploadURL = this.modalService.uploadURL;
    this.apiURL = this.constURL.URL;
    this.uploadsFilePath = this.modalService.uploadsFilePath;
  }

  ngOnInit() {
  }

  getAllImages() {
    this.modalService.getImageFiles().subscribe(files => {
    this.Imagefiles = files;
    this.numOfImages = this.Imagefiles.length;
    // console.log( this.numOfImages);
    });
  }

  imageFinishedUploading(file: FileHolder) {
    this.getAllImages();
    this.selectedImages = [];
    this.response = file.serverResponse;
    this.res = this.response._body;
    this.showSelectTab();
    // console.log(this.response._body);
  }

  getImageName(imagename: string) {
    this.selectedImages.unshift(imagename);
    const i = this.selectedImages.filter( item => item === imagename).length;
    if (i >= 2) {
        this.selectedImages = this.selectedImages.filter(function(item) {
          return item !== imagename;
        });
    }
    this.NumSelectedImg = this.selectedImages.length;
    // console.log(this.selectedImages);
  }

  moveImageToForm() {
    this.modalValue.emit(false);
    this.imagesToForm.emit(this.selectedImages);
    this.inputRequesting = this.modalService.inputId;
    this.inputRequest.emit(this.inputRequesting);
    // console.log(this.inputRequesting);
  }

  showUploadTab() {
      this.showUpTab = false;
      this.showSelTab = false;
      this.active = 'tabActive';
      this.active2 = 'tabInactive';
  }

  showSelectTab() {
      this.showSelTab = true;
      this.showUpTab = true;
      this.active = 'tabInactive';
      this.active2 = 'tabActive';
  }

  closeModal() {
    this.modalValue.emit(false);
    this.getAllImages();
    this.selectedImages = [];
    this.res = '';
  }

}
