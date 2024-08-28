import Image from 'next/image';
import * as LocalImages from '@/utils/imageImports';
import { cls } from '@/utils/config';
import { BsCheck } from 'react-icons/bs';

const modalContentConfig = {
  login: {
    closeImage: LocalImages.ImageModalClose,
    image: LocalImages.ImageTtorangHi,
    title: '로그인을 진행해주세요',
    kakoImage: LocalImages.ImageKakoLogo,
    kakoLogin: '카카오로 시작하기',
    noneLogin: '로그인 없이 체험할게요',
  },
  delete: {
    image: LocalImages.ImageModalDelete,
    title: '정말 삭제를 진행하시겠어요?',
    description: '삭제 시 복구가 불가능해요',
    confirmText: '네',
  },
  withdrawal: {
    image: LocalImages.ImageTtorangWithdrawal,
    title: '정말 탈퇴하시겠어요?',
    description: '탈퇴하시면 모든 정보를 잃게 돼요',
    confirmText: '네',
  },
  announceLoading: {
    image: LocalImages.ImageModalScriptIcon,
    title: '초안 정보를 불러오고 있어요',
  },
  qaLoading: {
    image: LocalImages.ImageModalScriptIcon,
    title: '예상 질문을 받아오고 있어요',
  },
  improvementMent: {
    closeImage: LocalImages.ImageModalClose,
    title: '개선 내용을 확인하세요',
    image: LocalImages.ImageModalScriptIcon,
  },
};

export default function Modal({ type, onClose, onConfirm, onLogin, movePage, improvementMent }) {
  const content = modalContentConfig[type];

  const renderLoginModal = () => (
    <div className="modal_box login_box">
      <div
        className="modal_close"
        onClick={onClose}
      >
        <Image
          src={content.closeImage}
          alt="ImageModalClose"
          width={24}
          height={24}
        />
      </div>
      <div className="character_box">
        <Image
          src={content.image}
          alt="ImageTtorangHi"
          width={120}
          height={120}
        />
      </div>
      <div className="login_ment">
        <p>{content.title}</p>
      </div>
      <div className="modalBtn_area">
        <button
          type="button"
          className="kakoLogin"
          onClick={onLogin}
        >
          <div className="kakoLogo">
            <Image
              src={content.kakoImage}
              alt="ImageKakoLogo"
              width={21}
              height={21}
            />
          </div>
          <span>{content.kakoLogin}</span>
        </button>
        <button
          type="button"
          className="noneLogin"
          onClick={() => {
            onClose();
            movePage();
          }}
        >
          {content.noneLogin}
        </button>
      </div>
    </div>
  );

  const renderDefaultModal = () => (
    <div className="modal_box modal_select">
      {type === 'improvementMent' && (
        <div
          className="modal_close"
          onClick={onClose}
        >
          <Image
            src={content.closeImage}
            alt="ImageModalClose"
            width={24}
            height={24}
          />
        </div>
      )}
      <div className="character_box">
        <Image
          src={content.image}
          alt="ModalImage"
          width={120}
          height={120}
        />
      </div>
      <div className="selectMent_box">
        <p className="title">{content.title}</p>
        {content.description && <p className="description">{content.description}</p>}
        {type === 'improvementMent' && (
          <ul className="improveList">
            {improvementMent.map((improve, index) => (
              <li key={index}>
                <span className="mt-[1px]">
                  <BsCheck
                    fontSize={18}
                    color="#509BF8"
                  />
                </span>
                <span>{improve}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {content.confirmText && (
        <div className="modalBtn_area">
          <button
            type="button"
            onClick={onClose}
          >
            아니요
          </button>
          <button
            type="button"
            onClick={onConfirm}
          >
            {content.confirmText}
          </button>
        </div>
      )}
    </div>
  );

  const renderLoading = () => (
    <div className="modal_box modal_loading">
      <div className="character_box">
        <Image
          src={content.image}
          alt="ImageModalScriptIcon"
          width={80}
          height={80}
        />
      </div>
      <p>{content.title}</p>
      <div className="loader_area">
        <span className="loader"></span>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cls('modalBlackBg', type === 'announceLoading' || type === 'qaLoading' ? '!cursor-default' : '')}
        onClick={onClose}
      />
      {type === 'login' && renderLoginModal()}
      {(type === 'delete' || type === 'withdrawal' || type === 'improvementMent') && renderDefaultModal()}
      {(type === 'announceLoading' || type === 'qaLoading') && renderLoading()}
    </>
  );
}
