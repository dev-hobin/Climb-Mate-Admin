import Model from '../core/Model.js';

const tag = '[ImageUploadModel]';

const dummyImages = [
  'http://placehold.it/200x200.jpg/ff0000/ffffff?text=1',
  'http://placehold.it/200x200.jpg/800000/ffffff?text=2',
  'http://placehold.it/200x200.jpg/808000/ffffff?text=3',
  'http://placehold.it/200x200.jpg/008080/ffffff?text=4',
  'http://placehold.it/200x200.jpg/800080/ffffff?text=5',
  'http://placehold.it/200x200.jpg/0000ff/ffffff?text=6',
  'http://placehold.it/200x200.jpg/F4A460/ffffff?text=7',
  'http://placehold.it/200x200.jpg/FFB6C1/ffffff?text=8',
  'http://placehold.it/200x200.jpg/87CEFA/ffffff?text=9',
  'http://placehold.it/200x200.jpg/F0E68C/ffffff?text=10',
];

export const IMAGE_UPLOADER_TYPE = {
  BANNER: 'banner',
  BORDERING: 'bordering',
  ENDURANCE: 'endurance',
};

const ImageUploadModel = class extends Model {
  constructor() {
    super();
    this._imageData = {
      [IMAGE_UPLOADER_TYPE.BANNER]: {
        initial: [],
        current: [],
        deleted: [],
      },
      [IMAGE_UPLOADER_TYPE.BORDERING]: {
        initial: [],
        current: [],
        deleted: [],
      },
      [IMAGE_UPLOADER_TYPE.ENDURANCE]: {
        initial: [],
        current: [],
        deleted: [],
      },
    };
  }

  /* 인터페이스 */
  initImages = async (accessToken, type) => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';

    let imagesInfo;
    if (type === IMAGE_UPLOADER_TYPE.BANNER) {
      const reqData = {
        reqCode: 3009,
        reqBody: {
          accessKey: accessToken,
        },
      };
      const {
        resCode,
        resBody: bannerInfo,
        resErr,
      } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL)
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: '배너 사진을 가져오는데 실패했습니다',
          },
          data: {},
        };

      imagesInfo = bannerInfo;
      console.log('배너 사진 정보', bannerInfo);
    } else if (type === IMAGE_UPLOADER_TYPE.BORDERING) {
      const reqData = {
        reqCode: 3010,
        reqBody: {
          accessKey: accessToken,
        },
      };
      const {
        resCode,
        resBody: borderingInfo,
        resErr,
      } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL)
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: '볼더링 사진을 가져오는데 실패했습니다',
          },
          data: {},
        };

      imagesInfo = borderingInfo;
      console.log('볼더링 사진 정보', borderingInfo);
    } else if (type === IMAGE_UPLOADER_TYPE.ENDURANCE) {
      const reqData = {
        reqCode: 3011,
        reqBody: {
          accessKey: accessToken,
        },
      };
      const {
        resCode,
        resBody: enduranceInfo,
        resErr,
      } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

      if (resCode == this.RES_CODE.FAIL)
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: '볼더링 사진을 가져오는데 실패했습니다',
          },
          data: {},
        };

      imagesInfo = enduranceInfo;
      console.log('지구력 사진 정보', enduranceInfo);
    } else throw '사용할 수 없는 이미지 업로더 타입입니다';

    imagesInfo.forEach(info => {
      this._imageData[type].initial.push({ ...info });
      this._imageData[type].current.push({ ...info });
    });
    return {
      isSuccess: true,
      error: {},
      data: {
        images: this._imageData[type].initial,
      },
    };
  };

  getInitialImages = type => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    return this._imageData[type].initial;
  };
  getCurrentImages = type => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    return this._imageData[type].current;
  };
  getDeletedImages = type => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    return this._imageData[type].deleted;
  };

  addCurrentImages = (type, images = []) => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    this._imageData[type].current.push(...images);
  };
  addDeletedImages = (type, index) => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    const deletedImages = this._imageData[type].current.splice(index, 1);
    this._imageData[type].deleted.push(...deletedImages);
  };

  changeImageLocation = (type, beforeIndex, afterIndex) => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    const draggedItemArray = this._imageData[type].current.splice(beforeIndex, 1);
    this._imageData[type].current.splice(afterIndex, 0, ...draggedItemArray);

    console.group(tag, type, '이미지 자리 변경 정보');
    console.log('자리 변경 전');
    console.log(this._imageData[type].current);
    console.log('자리 변경 후');
    console.log(this._imageData[type].current);
    console.groupEnd();
  };

  isImagesChanged = type => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    // 1. 배열 길이 비교 -> 다르면 무조건 달라진 것
    if (this._imageData[type].initial.length !== this._imageData[type].current.length) return true;
    // 2. 하나 하나 비교
    for (const [index, image] of this._imageData[type].current.entries()) {
      if (this._imageData[type].initial[index] === image) continue;
      else return true;
    }
    return false;
  };

  vaildateImageFiles = (fileList, initialCount) => {
    if (fileList.length === 0) return [];

    let currentImageCount = initialCount;

    const validatedFiles = [];
    const errorList = [];

    for (const file of fileList) {
      // 1. 사진 개수 검사 (최대 30장)
      if (!this._checkImageCount(currentImageCount)) {
        errorList.push({
          title: '사진 업로드 허용 개수 초과',
          description: '사진은 최대 30장까지 업로드 가능합니다',
        });
        break;
      }
      currentImageCount++;
      // 2. 확장자 검사
      if (!this._checkImageExtension(file.name)) {
        errorList.push({
          title: `허용된 파일 형식이 아닙니다 (${file.name})`,
          description: '사진 업로드는 .jpg, .png, .jpeg 형식의 파일만 가능합니다',
        });
        continue;
      }
      // 3. 용량 검사
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
  uploadImages = async type => {
    if (!this._checkType(type)) throw '사용할 수 없는 이미지 업로더 타입입니다';
    const [files, urls, willDeleted] = this._addExtraInfo(type);

    console.log(tag, type, '업로드할 파일만 뽑아낸 정보');
    console.log(files);
    console.log(tag, type, '이미 등록된 url만 뽑아낸 정보');
    console.log(urls);
    console.log(tag, type, '삭제할 이미지');
    console.log(willDeleted);

    console.log(tag, type, '이미지 업로드 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, type, '업로드 완료 후 데이터 재설정');
    console.log(tag, type, '성공 결과 반환');
    return true;
  };

  /* 메소드 */
  _checkImageCount = count => {
    if (count >= 30) return false;
    else return true;
  };
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
      case type === IMAGE_UPLOADER_TYPE.BANNER:
      case type === IMAGE_UPLOADER_TYPE.BORDERING:
      case type === IMAGE_UPLOADER_TYPE.ENDURANCE:
        return true;
      default:
        return false;
    }
  };

  _addExtraInfo = type => {
    const orderedList = this._imageData[type].current.map((image, index) => {
      if (typeof image === 'object') return { order: index + 1, file: image };
      else return { order: index + 1, url: image };
    });

    console.log(tag, type, '이미지에 순서 정보 추가');
    console.log(orderedList);

    const files = orderedList.filter(imageObj => imageObj.hasOwnProperty('file'));
    const urls = orderedList.filter(imageObj => imageObj.hasOwnProperty('url'));
    const willDeleted = this._imageData[type].deleted.filter(image => typeof image === 'string');

    return [files, urls, willDeleted];
  };
};

export default ImageUploadModel;
