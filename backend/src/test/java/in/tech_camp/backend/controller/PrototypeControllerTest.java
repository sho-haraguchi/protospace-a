package in.tech_camp.backend.controller;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private PrototypeEntity mockPrototype;

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

        mockPrototype = new PrototypeEntity();
        mockPrototype.setId(1);
        mockPrototype.setName("テストプロトタイプ");
        mockPrototype.setSlogan("テストキャッチコピー");
        mockPrototype.setConcept("テストコンセプト");
        mockPrototype.setImage("uuid_test.jpg");
        mockPrototype.setUserId(1);
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

        when(prototypeService.updatePrototype(eq(prototypeId), any(PrototypeEditForm.class), any()))
                .thenReturn(updatedEntity);

        // 実行
        PrototypeEntity result = prototypeController.updatePrototype(prototypeId, editForm, null);

        // 検証
        assertNotNull(result);
        assertEquals("編集後のプロトタイプ名", result.getName());
        verify(prototypeService, times(1)).updatePrototype(eq(prototypeId), any(PrototypeEditForm.class), any());
  @Nested
    @DisplayName("2. プロトタイプ一覧取得機能")
    class GetAllPrototypes {

        @Test
        @DisplayName("2-1. 正常系: 登録済みのプロトタイプ一覧が正常に取得できること")
        void getAllPrototypes_Success() {
            // 【Given: 事前準備】
            // findAllPrototypes() が呼ばれたらプロトタイプが1件入ったリストを返すよう設定
            when(prototypeService.findAllPrototypes()).thenReturn(List.of(mockPrototype));

            // 【When: 実行】
            List<PrototypeEntity> result = prototypeController.showPrototypes();

            // 【Then: 検証】
            assertNotNull(result);
            assertEquals(1, result.size()); // 件数が1件であること
            assertEquals("テストプロトタイプ", result.get(0).getName()); // データの中身が正しいこと
            verify(prototypeService, times(1)).findAllPrototypes(); // 呼び出しの検証
        }
    }

    // =========================================================================
    // 3. プロトタイプ詳細取得機能のテスト
    // =========================================================================
    @Nested
    @DisplayName("3. プロトタイプ詳細表示機能")
    class ShowPrototypeDetail {

        @Test
        @DisplayName("3-1. 正常系: 存在するIDを指定した場合、詳細エンティティが返ること")
        void showPrototypeDetail_Success() {
            // 【Given: 事前準備】
            when(prototypeService.findById(1)).thenReturn(mockPrototype);

            // 【When: 実行】
            PrototypeEntity result = prototypeController.showPrototypeDetail(1);

            // 【Then: 検証】
            assertNotNull(result);
            assertEquals(1, result.getId());
            assertEquals("テストプロトタイプ", result.getName());
            assertEquals("テストキャッチコピー", result.getSlogan());
            verify(prototypeService, times(1)).findById(1);
        }

        @Test
        @DisplayName("3-2. 異常系: 存在しないIDを指定した場合、null が返ること")
        void showPrototypeDetail_NotFound() {
            // 【Given: 事前準備】
            when(prototypeService.findById(999)).thenReturn(null);

            // 【When: 実行】
            PrototypeEntity result = prototypeController.showPrototypeDetail(999);

            // 【Then: 検証】
            assertEquals(null, result); // 返り値が null であること
            verify(prototypeService, times(1)).findById(999);
        }
    }

    // =========================================================================
    // 4. 画像ファイル配信機能のテスト (/api/images/{filename})
    // =========================================================================
    @Nested
    @DisplayName("4. 画像取得機能 (/api/images/{filename})")
    class GetImage {

        @Test
        @DisplayName("4-1. 異常系: ローカルに存在しない画像ファイル名の場合、404 Not Found が返ること")
        void getImage_NotFound() {
            String filename = "non_existent_file_12345.jpg";

            // 🌟 実際の Controller ロジック（ローカルファイル探索）をテスト
            ResponseEntity<Resource> response = prototypeController.getImage(filename);

            assertNotNull(response);
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }

        @Test
        @DisplayName("4-2. 異常系: パス区切り文字が含まれる場合でも、safeに処理されて存在しなければ404が返ること")
        void getImage_DirectoryTraversal_NotFound() {
            String filename = "../../../secret.txt";

            ResponseEntity<Resource> response = prototypeController.getImage(filename);

            assertNotNull(response);
            // cleanFileName で安全にファイル名が抽出され、存在しないため 404 になることを検証
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }
    }
}
}