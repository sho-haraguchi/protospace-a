package in.tech_camp.backend.service;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.repository.PrototypeRepository;
import in.tech_camp.backend.form.PrototypeEditForm;

@ExtendWith(MockitoExtension.class)
class PrototypeServiceTest {

    @Mock
    private PrototypeRepository prototypeRepository;

    @Mock
    private StorageService storageService;

    @InjectMocks
    private PrototypeService prototypeService;

    private PrototypeForm validForm;
    private MockMultipartFile validImage;
    private Integer currentUserId;

    @BeforeEach
    void setUp() {
        // テスト用ダミー画像ファイルの作成
        validImage = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        // テスト用フォームの作成
        validForm = new PrototypeForm();
        validForm.setName("テストプロトタイプ");
        validForm.setSlogan("テストキャッチコピー");
        validForm.setConcept("テストコンセプト");
        validForm.setImage(validImage);

        currentUserId = 1;
    }

    @Test
    @DisplayName("1-1. 正常系: プロトタイプ情報が正しくDBに保存され、作成されたEntityが返されること")
    void createPrototype_Success() throws IOException {
        // 画像保存成功時のファイル名をモックで定義
        String expectedSavedFileName = "uuid_test.jpg";
        when(storageService.storeFile(validImage)).thenReturn(expectedSavedFileName);

        // 実行
        PrototypeEntity result = prototypeService.createPrototype(validForm, currentUserId);

        // 検証
        assertNotNull(result);
        assertEquals("テストプロトタイプ", result.getName());
        assertEquals("テストキャッチコピー", result.getSlogan());
        assertEquals("テストコンセプト", result.getConcept());
        assertEquals(expectedSavedFileName, result.getImage());
        assertEquals(currentUserId, result.getUserId());

        // prototypeRepository.insert() が 1 回呼ばれたことを検証
        verify(prototypeRepository, times(1)).insert(any(PrototypeEntity.class));
    }

    @Test
    @DisplayName("1-2. ファイル保存処理: StorageService の storeFile メソッドが呼ばれること")
    void createPrototype_StorageServiceIsCalled() throws IOException {
        when(storageService.storeFile(validImage)).thenReturn("uuid_test.jpg");

        // 実行
        prototypeService.createPrototype(validForm, currentUserId);

        // storageService.storeFile() が 1 回呼ばれたことを検証
        verify(storageService, times(1)).storeFile(validImage);
    }

    @Test
    @DisplayName("1-3. 異常系: 画像の保存時に IOException が発生した場合、DBへの保存処理が実行されないこと")
    void createPrototype_StorageError_DoesNotSaveToDb() throws IOException {
        // StorageService で IOException が発生するようにモックを設定
        when(storageService.storeFile(validImage)).thenThrow(new IOException("ファイル保存エラー"));

        // 例外が発生することを検証
        assertThrows(IOException.class, () -> {
            prototypeService.createPrototype(validForm, currentUserId);
        });

        // 例外発生のため DB への insert 処理が一度も実行されないことを検証
        verify(prototypeRepository, never()).insert(any(PrototypeEntity.class));
    }

    @Test
    @DisplayName("画像変更なしでプロトタイプを更新した場合、既存の画像パスが維持されること")
    void updatePrototype_Success_WithoutImage() throws IOException {
        Integer prototypeId = 1;
        PrototypeEditForm editForm = new PrototypeEditForm();
        editForm.setName("編集後のプロトタイプ名");
        editForm.setSlogan("編集後のキャッチコピー");
        editForm.setConcept("編集後のコンセプト");
        editForm.setImage(null); // 画像は更新しないため null

        PrototypeEntity existingEntity = new PrototypeEntity();
        existingEntity.setId(prototypeId);
        existingEntity.setImage("existing_image.png"); // 既存の画像パス

        when(prototypeRepository.findById(prototypeId)).thenReturn(existingEntity);

        // 実行
        PrototypeEntity result = prototypeService.updatePrototype(prototypeId, editForm);

        // 検証: 画像無しプロトタイプにならないことの証明
        assertNotNull(result);
        assertEquals("編集後のプロトタイプ名", result.getName());
        assertEquals("existing_image.png", result.getImage()); // 旧画像が保持されていること

        // 画像保存処理は呼ばれていないこと、DB更新が1回呼ばれていること
        verify(storageService, never()).storeFile(any());
        verify(prototypeRepository, times(1)).update(existingEntity);
    }

    @Test
    @DisplayName("画像変更ありでプロトタイプを更新した場合、新しい画像が保存されパスが更新されること")
    void updatePrototype_Success_WithImage() throws IOException {
        Integer prototypeId = 1;
        MockMultipartFile newImage = new MockMultipartFile(
                "image", "new_image.jpg", "image/jpeg", "new image data".getBytes()
        );

        PrototypeEditForm editForm = new PrototypeEditForm();
        editForm.setName("編集後のプロトタイプ名");
        editForm.setSlogan("編集後のキャッチコピー");
        editForm.setConcept("編集後のコンセプト");
        editForm.setImage(newImage); // 新しい画像を添付

        PrototypeEntity existingEntity = new PrototypeEntity();
        existingEntity.setId(prototypeId);
        existingEntity.setImage("existing_image.png");

        when(prototypeRepository.findById(prototypeId)).thenReturn(existingEntity);
        when(storageService.storeFile(newImage)).thenReturn("uuid_new_image.jpg");

        // 実行
        PrototypeEntity result = prototypeService.updatePrototype(prototypeId, editForm);

        // 検証
        assertNotNull(result);
        assertEquals("uuid_new_image.jpg", result.getImage()); // 新しいファイル名に上書きされていること
        verify(storageService, times(1)).storeFile(newImage);
        verify(prototypeRepository, times(1)).update(existingEntity);
    }
}