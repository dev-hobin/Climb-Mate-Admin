import View from '../core/View.js';

const tag = '[BorderingImageUploadView]';
const BASE_URL = 'http://13.209.4.105/';

const BorderingImageUploadView = class extends View {
  constructor() {
    super();

    this.clickable = true;

    // this._dragStartIndex = null;
    // this._dragEndIndex = null;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._imageCount = element.querySelector('[data-image-count]');
    this._addBtn = element.querySelector('[data-add-btn]');
    this._imageInput = element.querySelector('[data-image-input]');
    this._imageList = element.querySelector('[data-image-list]');
    this._editBtn = element.querySelector('[data-edit-btn]');

    this._bindEvents();

    return this;
  };

  initItems = imageUrlArray => {
    if (imageUrlArray.length === 0) return this._setNoneMessage();
    // 아이템 만들어서 이벤트 달기
    const itemsArray = imageUrlArray
      .sort((a, b) => Number(a.imageOrder) - Number(b.imageOrder))
      .map(info => {
        const { id, imageOrder, imageOriginalUrl, imageThumbUrl } = info;
        const item = this._makeItem(imageThumbUrl);
        this._addItemEvent(item);
        return item;
      });
    // 이미지 리스트 비우기
    this._imageList.innerHTML = '';
    // 이미지 리스트에 아이템들 추가
    this._imageList.append(...itemsArray);
    // 이미지 개수 설정
    this._imageCount.textContent = `( ${this._imageList.children.length} / 30 )`;
  };
  addItems = imageFiles => {
    this._removeNoneMessage();

    const itemsArray = imageFiles.map(file => {
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl);
      const item = this._makeItem(imageUrl, true);
      this._addItemEvent(item);
      // 아이템 로드 되면 url 객체 메모리에서 해제
      item.onload = () => URL.revokeObjectURL(imageUrl);
      return item;
    });
    // 이미지 리스트에 아이템들 추가
    this._imageList.append(...itemsArray);
    // 이미지 개수 설정
    this._imageCount.textContent = `( ${this._imageList.children.length} / 30 )`;
  };
  removeItem = index => {
    // 전체 아이템 가져온다
    const items = this._element.querySelectorAll('[data-image-item]');
    // 삭제될 인덱스에 해당하는 아이템을 삭제한다
    items[index].remove();
    // 이미지 개수 설정
    this._imageCount.textContent = `( ${this._imageList.children.length} / 30 )`;

    this._checkItemExist();
  };

  // 메소드
  _bindEvents = () => {
    // 이미지 리스트에 드래그 오버 이벤트 달기
    // this._imageList.addEventListener('dragover', event => {
    //   // 마우스 포인터 차단 모양 없애기
    //   event.preventDefault();
    //   // 업로더 종류
    //   const uploaderType = event.currentTarget.parentElement.dataset.uploader;
    //   // 드래그 중인 아이템 없으면 차단
    //   const draggingItem = document.querySelector('.dragging');
    //   if (!draggingItem) return;
    //   // 드래그 중인 아이템의 종류와 업로더 종류가 다르면 차단
    //   const draggingItemType = draggingItem.parentElement.parentElement.dataset.uploader;
    //   if (uploaderType !== draggingItemType) return;

    //   // 자리 변경
    //   const closestItemInfo = this._getClosestItemInfo(this._imageList, event.clientX, event.clientY);
    //   if (closestItemInfo.length === 0) return;
    //   const { appendDirection, item } = closestItemInfo[0];
    //   if (appendDirection === 'after') item.insertAdjacentElement('afterend', draggingItem);
    //   else item.insertAdjacentElement('beforebegin', draggingItem);
    // });
    // 이미지 url 이동 방지
    // this._imageList.addEventListener('drop', event => event.preventDefault());
    // 이미지 인풋 이벤트 달기
    this._imageInput.addEventListener('change', event => {
      if (event.target.files.length === 0) return;
      const fileList = [...event.target.files];
      this.trigger('@addImages', { view: this, type: 'bordering', fileList });
    });
    // 업로드 트리거 이벤트 달기
    this._editBtn.addEventListener('click', () => {
      if (!this.clickable) return;
      this.trigger('@editImages', { view: this, type: 'bordering' });
    });
  };

  // 리스트 아이템 만들기
  _makeItem = (imageUrl, isBlob = false) => {
    const item = document.createElement('li');
    item.setAttribute('class', 'upload-image-item');
    item.setAttribute('data-image-item', '');

    let innerHtml = '';
    if (isBlob) {
      innerHtml = `<figure class="upload-image-item__figure">
        <img class="upload-image-item__img" src="${imageUrl}" alt="볼더링 이미지">
        <button class="upload-image-item__delete-btn" data-delete-btn>X</button>
      </figure>`;
    } else {
      innerHtml = `<figure class="upload-image-item__figure">
        <img class="upload-image-item__img" src="${BASE_URL}${imageUrl}" alt="볼더링 이미지">
        <button class="upload-image-item__delete-btn" data-delete-btn>X</button>
      </figure>`;
    }

    item.innerHTML = innerHtml;

    return item;
  };
  // 리스트 아이템에 이벤트 달아주기
  _addItemEvent = item => {
    // 드래그 이벤트
    // item.addEventListener('dragstart', () => {
    //   item.classList.add('dragging');
    //   this._dragStartIndex = Array.from(item.parentNode.children).indexOf(item);
    // });
    // item.addEventListener('dragend', () => {
    //   item.classList.remove('dragging');
    //   this._dragEndIndex = Array.from(item.parentNode.children).indexOf(item);
    //   // 아이템간 자리 바뀐게 있다면 컨트롤러에게 자리 바뀌었다고 알림
    //   if (this._dragStartIndex !== this._dragEndIndex)
    //     this.trigger('@changeImageLocation', {
    //       type: 'bordering',
    //       beforeIndex: this._dragStartIndex,
    //       afterIndex: this._dragEndIndex,
    //     });
    //   // 드래그 끝내면 인덱스는 초기화
    //   this._dragStartIndex = null;
    //   this._dragEndIndex = null;
    // });
    // 아이템 삭제 트리거 이벤트
    const deleteBtn = item.querySelector('[data-delete-btn]');
    deleteBtn.addEventListener('click', () => {
      const deletedIndex = Array.from(item.parentNode.children).indexOf(item);
      this.trigger('@showAlert', {
        view: this,
        description: '정말로 삭제하시겠습니까?',
        eventInfo: {
          eventName: 'image-uploader__delete-image',
          type: 'bordering',
          index: deletedIndex,
        },
      });
    });
  };
  // // 아이템 드래그 할 때 가장 가까운 아이템 정보 가져오기
  // _getClosestItemInfo = (itemList, clientX, clientY) => {
  //   // 모든 아이템 가져온다 (드래그중인 아이템 제외)
  //   const otherItems = [...itemList.querySelectorAll('[data-image-item]:not(.dragging)')];

  //   return (
  //     otherItems
  //       // 아이템 하나씩 뽑아서 가장 가까운 아이템만 객체로 필요한 정보 담아서 새 배열로 만든다
  //       .map(item => {
  //         const itemRect = item.getBoundingClientRect();
  //         // 아이템 반지름
  //         const itemRadius = itemRect.width / 2;
  //         // 아이템 중심 좌표
  //         const itemCenterX = itemRect.left + itemRadius;
  //         const itemCenterY = itemRect.top + itemRadius;
  //         // 마우스 포인터와의 거리 차이
  //         const distanceX = Math.abs(clientX - itemCenterX);
  //         const distanceY = Math.abs(clientY - itemCenterY);

  //         if (distanceX < itemRadius && distanceY < itemRadius) {
  //           if (clientX - itemCenterX > 0) return { appendDirection: 'after', item };
  //           else return { appendDirection: 'before', item };
  //         } else return null;
  //       })
  //       // 정보가 있는 아이템만 필터 -> [{가장 가까운 아이템의 정보}], 가장 가까운 아이템이 없는 경우 -> []
  //       .filter(info => info !== null)
  //   );
  // };
  // 리스트에 사진 있는지 없는지 체크 후 인포 메세지 관리
  _checkItemExist = () => {
    const itemCount = this._imageList.querySelectorAll('[data-image-item]').length;
    if (itemCount === 0) return this._setNoneMessage();
    this._removeNoneMessage();
  };
  // 사진이 하나도 없을 때 인포 메세지 표시
  _setNoneMessage = () => {
    let infoMessage = this._imageList.querySelector('.image-uploader__none-info');
    if (infoMessage) return;

    infoMessage = document.createElement('span');
    infoMessage.setAttribute('class', 'image-uploader__none-info');
    infoMessage.textContent = '볼더링 사진을 추가해주세요!';
    this._imageList.append(infoMessage);
  };
  // 인포 메세지 삭제
  _removeNoneMessage = () => {
    const infoMessage = this._imageList.querySelector('.image-uploader__none-info');
    if (!infoMessage) return;
    infoMessage.remove();
  };
};

export default BorderingImageUploadView;
