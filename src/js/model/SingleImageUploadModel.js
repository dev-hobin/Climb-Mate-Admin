import Model from '../core/Model.js';

const tag = '[SingleImageUploadModel]';

const dummyImage = 'http://placehold.it/200x200.jpg/ff0000/ffffff?text=1';

export const SINGLE_IMAGE_UPLOADER_TYPE = {
  PRICE: 'PRICE',
  LEVEL: 'LEVEL',
};

const SingleImageUploadModel = class extends Model {
  constructor() {
    super();
    this._imageData = {
      [SINGLE_IMAGE_UPLOADER_TYPE.PRICE]: {
        initial: '',
        current: '',
      },
      [SINGLE_IMAGE_UPLOADER_TYPE.LEVEL]: {
        initial: '',
        current: '',
      },
    };
  }

  /* 인터페이스 */
  initImage = async (accessToken, type) => {
    if (type === SINGLE_IMAGE_UPLOADER_TYPE.PRICE) {
      console.log('가격표 이미지 정보 더미 데이터', dummyImage);
      const reqData = {
        reqCode: 3006,
        reqBody: {
          accessKey: accessToken,
        },
      };
      const {
        resCode,
        resBody: [{ detailCenterGoodsImageURL }],
        resErr,
      } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

      console.log('가격표 이미지 정보', detailCenterGoodsImageURL);
    } else if (type === SINGLE_IMAGE_UPLOADER_TYPE.LEVEL) {
      console.log('난이도 이미지 정보 더미 데이터', dummyImage);
      const reqData = {
        reqCode: 3014,
        reqBody: {
          accessKey: accessToken,
        },
      };
      const {
        resCode,
        resBody: [{ detailCenterLevelImageURL }],
        resErr,
      } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

      console.log('난이도 이미지 정보', detailCenterLevelImageURL);
    }

    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';
    this._imageData[type].initial = dummyImage;
    this._imageData[type].current = dummyImage;
    return this._imageData[type].initial;
  };

  getInitialImage = type => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';
    return this._imageData[type].initial;
  };
  getCurrentImage = type => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';
    return this._imageData[type].current;
  };

  changeCurrentImage = (type, fileList) => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';
    if (fileList.length === 0) throw '파일을 받지 못했습니다';
    this._imageData[type].current = fileList[0];
  };

  isImageChanged = type => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';
    if (this._imageData[type].initial !== this._imageData[type].current) return true;
    return false;
  };

  vaildateImageFile = fileList => {
    if (fileList.length === 0) return [];

    const validatedFiles = [];
    const errorList = [];

    for (const file of fileList) {
      // 확장자 검사
      if (!this._checkImageExtension(file.name)) {
        errorList.push({
          title: `허용된 파일 형식이 아닙니다 (${file.name})`,
          description: '사진 업로드는 .jpg, .png, .jpeg 형식의 파일만 가능합니다',
        });
        continue;
      }
      // 용량 검사
      if (!this._checkImageSize(file.size)) {
        errorList.push({
          title: `사진 업로드 허용 용량 초과 (${file.name})`,
          description: '10MB 이하의 사진 파일만 업로드 가능합니다',
        });
        continue;
      }
      validatedFiles.push(file);
    }
    return [validatedFiles, errorList];
  };

  uploadImage = async type => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';

    console.log(tag, this._imageData[type].current);
    console.log(tag, type, '이미지 업로드 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, type, '업로드 완료 후 결과 반환');
    return true;
  };
  deleteImage = async type => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';

    this._imageData[type].current = '';

    console.log(tag, type, '이미지 삭제중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, type, '삭제 완료 후 데이터 수정');
    this._imageData[type].initial = this._imageData[type].current;
    console.log(tag, type, '결과 반환');
    return true;
  };
  cancelImage = type => {
    this._imageData[type].current = this._imageData[type].initial;
    return this._imageData[type].current;
  };

  /* 메소드 */
  _checkImageExtension = fileName => {
    const extentions = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];
    const splittedNames = fileName.split('.');
    // 파일 확장자 제대로 안나뉘어진 경우
    if (splittedNames.length <= 1) return false;
    // 현재 파일 확장자
    const fileExtention = splittedNames[splittedNames.length - 1];
    // 허용한 확장자인지 확인
    if (!extentions.includes(fileExtention)) return false;
    else return true;
  };
  _checkImageSize = fileSize => {
    const maxSize = 10 * 1024 * 1024;
    if (fileSize > maxSize) return false;
    else return true;
  };
  _checkType = type => {
    switch (true) {
      case type === SINGLE_IMAGE_UPLOADER_TYPE.PRICE:
      case type === SINGLE_IMAGE_UPLOADER_TYPE.LEVEL:
        return true;
      default:
        return false;
    }
  };
};

export default SingleImageUploadModel;
