import Model from '../core/Model.js';

const tag = '[ImageUploadModel]';

const ImageUploadModel = class extends Model {
  constructor() {
    super();
  }

  /* 인터페이스 */
  getBannerImages = async (centerId = '') => {
    // 미리 이미지 아이템이 등록되있다고 가정한 더미 데이터
    return [
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
  };
  getBoreringImages = async (centerId = '') => {
    // 미리 이미지 아이템이 등록되있다고 가정한 더미 데이터
    return [
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
  };
  getEnduranceImages = async (centerId = '') => {
    // 미리 이미지 아이템이 등록되있다고 가정한 더미 데이터
    return [
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
  uploadImages = async (files = []) => {
    console.log(`${tag} 이미지 업로드 시작`);
    console.log(`${tag} 업로드 진행중`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`${tag} 업로드 완료 후 결과 반환`);
    return true;
  };

  /* 메소드 */
  _checkImageCount = count => {
    console.log(count);
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
};

export default ImageUploadModel;
