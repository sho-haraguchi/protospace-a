package in.tech_camp.backend.controller;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.service.PrototypeService;
import in.tech_camp.backend.form.PrototypeEditForm;

@ExtendWith(MockitoExtension.class)
class PrototypeControllerTest {

    @Mock
    private PrototypeService prototypeService; // 依存先をモック化

    @InjectMocks
    private PrototypeController prototypeController; // モックを注入したテスト対象

    private PrototypeForm validForm;
    private MockMultipartFile validImage;

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
    }

    @Test
    @DisplayName("1-1. 正常系: 正しいパラメータを送信した際、PrototypeService が正しく呼び出されること")
    void postPrototypes_Success_ShouldCallService() throws IOException {
        // モックの戻り値を定義
        PrototypeEntity mockEntity = new PrototypeEntity();
        mockEntity.setName("テストプロトタイプ");
        mockEntity.setSlogan("テストキャッチコピー");
        mockEntity.setConcept("テストコンセプト");
        mockEntity.setImage("uuid_test.jpg");
        mockEntity.setUserId(1);

        when(prototypeService.createPrototype(any(PrototypeForm.class), eq(1))).thenReturn(mockEntity);

        // コントローラーのメソッドを直接呼び出す
        PrototypeEntity result = prototypeController.postPrototypes(validForm);

        // PrototypeService の createPrototype メソッドが 1 回呼ばれたことを検証
        verify(prototypeService, times(1)).createPrototype(any(PrototypeForm.class), eq(1));

        // 戻り値の検証
        assertNotNull(result);
        assertEquals("テストプロトタイプ", result.getName());
        assertEquals("テストキャッチコピー", result.getSlogan());
        assertEquals("テストコンセプト", result.getConcept());
        assertEquals("uuid_test.jpg", result.getImage());
    }

    @Test
    @DisplayName("1-2. 正常系: 送信された PrototypeForm の値がそのまま PrototypeService へ引き渡されること")
    void postPrototypes_Success_FormValuesPassedToService() throws IOException {
        // コントローラー実行
        prototypeController.postPrototypes(validForm);

        // Service に正確に validForm オブジェクトが渡っているか検証
        verify(prototypeService).createPrototype(validForm, 1);
    }

    @Test
    @DisplayName("正常なデータで編集リクエストが送られた場合、Serviceの更新処理が呼び出されること")
    void updatePrototype_Success_ShouldCallService() throws IOException {
        Integer prototypeId = 1;
        PrototypeEditForm editForm = new PrototypeEditForm();
        editForm.setName("編集後のプロトタイプ名");
        editForm.setSlogan("編集後のキャッチコピー");
        editForm.setConcept("編集後のコンセプト");
        editForm.setImage(validImage);

        PrototypeEntity updatedEntity = new PrototypeEntity();
        updatedEntity.setId(prototypeId);
        updatedEntity.setName("編集後のプロトタイプ名");
        updatedEntity.setImage("uuid_test.jpg");

        when(prototypeService.updatePrototype(eq(prototypeId), any(PrototypeEditForm.class)))
                .thenReturn(updatedEntity);

        // 実行
        PrototypeEntity result = prototypeController.updatePrototype(prototypeId, editForm);

        // 検証
        assertNotNull(result);
        assertEquals("編集後のプロトタイプ名", result.getName());
        verify(prototypeService, times(1)).updatePrototype(eq(prototypeId), any(PrototypeEditForm.class));
    }
}