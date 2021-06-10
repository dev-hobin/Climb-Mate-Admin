import Model from '../core/Model.js';

const tag = '[SingleImageUploadModel]';

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
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';

    this._imageData[type].initial = '';
    this._imageData[type].current = '';

    let result;
    if (type === SINGLE_IMAGE_UPLOADER_TYPE.PRICE) {
      const reqData = {
        reqCode: 3006,
        reqBody: { accessKey: accessToken },
      };
      const {
        resCode,
        resBody: [{ detailCenterGoodsImageURL }],
        resErr,
      } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL) {
        result = {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr,
          },
          data: {},
        };
      } else {
        const imageUrl = detailCenterGoodsImageURL ? `${this.HOST.SERVER}/${detailCenterGoodsImageURL}` : '';
        result = {
          isSuccess: true,
          error: {},
          data: {
            imageUrl,
          },
        };
      }
    } else if (type === SINGLE_IMAGE_UPLOADER_TYPE.LEVEL) {
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
      } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL) {
        result = {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr,
          },
          data: {},
        };
      } else {
        const imageUrl = detailCenterLevelImageURL ? `${this.HOST.SERVER}/${detailCenterLevelImageURL}` : '';
        result = {
          isSuccess: true,
          error: {},
          data: {
            imageUrl,
          },
        };
      }
    } else throw '사용할 수 없는 타입입니다';

    const { isSuccess, error, data } = result;
    if (!isSuccess) {
      return result;
    } else {
      this._imageData[type].initial = data.imageUrl;
      this._imageData[type].current = data.imageUrl;
      return result;
    }
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

  editImage = async (type, accessToken, centerId, centerName) => {
    const { isSuccess, error, data } = await this._uploadImage(type, centerName, centerId);
    if (!isSuccess) return { isSuccess, error, data };

    const { imgUrl } = data;

    if (type === SINGLE_IMAGE_UPLOADER_TYPE.PRICE) {
      const reqData = {
        reqCode: 1204,
        reqBody: {
          accessKey: accessToken,
          id: centerId,
          detailCenterGoodsImageURL: imgUrl,
        },
      };
      console.log('보낸 데이터', reqData);
      const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL) {
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr,
          },
          data: {},
        };
      } else {
        return {
          isSuccess: true,
          error: {},
          data: {
            imgUrl: `${this.HOST.SERVER}/${imgUrl}`,
          },
        };
      }
    } else if (type === SINGLE_IMAGE_UPLOADER_TYPE.LEVEL) {
      const reqData = {
        reqCode: 1400,
        reqBody: {
          accessKey: accessToken,
          id: centerId,
          detailCenterLevelImageURL: imgUrl,
        },
      };
      console.log('보낸 데이터', reqData);
      const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL) {
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr,
          },
          data: {},
        };
      } else {
        return {
          isSuccess: true,
          error: {},
          data: {
            imgUrl: `${this.HOST.SERVER}/${imgUrl}`,
          },
        };
      }
    } else throw '사용 가능한 타입이 아닙니다';
  };
  deleteImage = async (type, accessToken, centerId) => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';

    if (type === SINGLE_IMAGE_UPLOADER_TYPE.PRICE) {
      const reqData = {
        reqCode: 1205,
        reqBody: {
          accessKey: accessToken,
          id: centerId,
        },
      };
      console.log('보낸 데이터', reqData);
      const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL) {
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr,
          },
          data: {},
        };
      } else {
        this._imageData[type].current = '';
        this._imageData[type].initial = '';
        return {
          isSuccess: true,
          error: {},
          data: {},
        };
      }
    } else if (type === SINGLE_IMAGE_UPLOADER_TYPE.LEVEL) {
      const reqData = {
        reqCode: 1404,
        reqBody: {
          accessKey: accessToken,
          id: centerId,
        },
      };
      console.log('보낸 데이터', reqData);
      const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL) {
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr,
          },
          data: {},
        };
      } else {
        this._imageData[type].current = '';
        this._imageData[type].initial = '';
        return {
          isSuccess: true,
          error: {},
          data: {},
        };
      }
    } else throw '사용 가능한 타입이 아닙니다';
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

  _uploadImage = async (type, centerName, centerId) => {
    if (!this._checkType(type)) throw '사용할 수 없는 타입입니다';

    const splitted = this.getCurrentImage(type).name.split('.');
    const imgExt = splitted[splitted.length - 1];

    const imgFormData = new FormData();
    if (type === SINGLE_IMAGE_UPLOADER_TYPE.PRICE) {
      imgFormData.append('goodsPhoto[]', this.getCurrentImage(type), `${centerName}.${centerId}.${imgExt}`);

      const { resCode, resBody, resErr } = await this.postRequest(
        this.HOST.SERVER,
        this.PATHS.SINGLE_IMAGE.PRICE,
        imgFormData,
        this.DATA_TYPE.FORM_DATA
      );

      console.log({ resCode, resBody, resErr });

      if (resCode == this.RES_CODE.FAIL) {
        const { success, error: errorDescription } = resBody;
        return {
          isSuccess: success,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr || errorDescription,
          },
          data: {},
        };
      } else {
        const {
          imageUrlArray: [{ originalUrl, success }],
        } = resBody;
        return {
          isSuccess: success,
          error: {},
          data: {
            imgUrl: originalUrl,
          },
        };
      }
    } else if (type === SINGLE_IMAGE_UPLOADER_TYPE.LEVEL) {
      imgFormData.append('settingLevel[]', this.getCurrentImage(type), `${centerName}.${centerId}.${imgExt}`);
      const { resCode, resBody, resErr } = await this.postRequest(
        this.HOST.SERVER,
        this.PATHS.SINGLE_IMAGE.LEVEL,
        imgFormData,
        this.DATA_TYPE.FORM_DATA
      );

      console.log({ resCode, resBody, resErr });

      if (resCode == this.RES_CODE.FAIL) {
        const { success, error: errorDescription } = resBody;
        return {
          isSuccess: success,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: resErr || errorDescription,
          },
          data: {},
        };
      } else {
        const {
          imageUrlArray: [{ originalUrl, success }],
        } = resBody;
        return {
          isSuccess: success,
          error: {},
          data: {
            imgUrl: originalUrl,
          },
        };
      }
    } else throw '사용할 수 없는 타입입니다';
  };
};

export default SingleImageUploadModel;
