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

import in.tech_camp.backend.custom_user.CustomUserDetail;
import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeEditForm;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.service.PrototypeService;

@ExtendWith(MockitoExtension.class)
class PrototypeControllerTest {

    @Mock
    private PrototypeService prototypeService;

    @Mock
    private CustomUserDetail mockUser;

    @InjectMocks
    private PrototypeController prototypeController;

    private PrototypeForm validForm;
    private MockMultipartFile validImage;
    private PrototypeEntity mockPrototype;

    @BeforeEach
    void setUp() {
        validImage = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

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

    // =========================================================================
    // 1. プロトタイプ投稿・編集機能のテスト
    // =========================================================================
    @Test
    @DisplayName("1-1. 正常系: 正しいパラメータを送信した際、PrototypeService が正しく呼び出されること")
    void postPrototypes_Success_ShouldCallService() throws IOException {
        PrototypeEntity mockEntity = new PrototypeEntity();
        mockEntity.setName("テストプロトタイプ");
        mockEntity.setSlogan("テストキャッチコピー");
        mockEntity.setConcept("テストコンセプト");
        mockEntity.setImage("uuid_test.jpg");
        mockEntity.setUserId(1);

        when(mockUser.getId()).thenReturn(1);
        when(prototypeService.createPrototype(any(PrototypeForm.class), eq(1))).thenReturn(mockEntity);

        ResponseEntity<?> response = prototypeController.postPrototypes(validForm, mockUser);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(prototypeService, times(1)).createPrototype(any(PrototypeForm.class), eq(1));
    }

    @Test
    @DisplayName("1-2. 正常系: 送信された PrototypeForm の値がそのまま PrototypeService へ引き渡されること")
    void postPrototypes_Success_FormValuesPassedToService() throws IOException {
        when(mockUser.getId()).thenReturn(1);

        prototypeController.postPrototypes(validForm, mockUser);

        verify(prototypeService).createPrototype(validForm, 1);
    }

@Test
    @DisplayName("1-3. 正常系: 正常なデータで編集リクエストが送られた場合、Serviceの更新処理が呼び出されること")
    void updatePrototype_Success_ShouldCallService() throws IOException {
        Integer prototypeId = 1;
        PrototypeEditForm editForm = new PrototypeEditForm();
        editForm.setName("編集後のプロトタイプ名");
        editForm.setSlogan("編集後のキャッチコピー");
        editForm.setConcept("編集後のコンセプト");
        editForm.setImage(validImage);

        // ⏬ テスト用のモックセッションとログインユーザーを作成
        jakarta.servlet.http.HttpSession mockSession = org.mockito.Mockito.mock(jakarta.servlet.http.HttpSession.class);
        in.tech_camp.backend.entity.UserEntity mockUserEntity = new in.tech_camp.backend.entity.UserEntity();
        mockUserEntity.setId(1);

        when(mockSession.getAttribute("user")).thenReturn(mockUserEntity);

        PrototypeEntity updatedEntity = new PrototypeEntity();
        updatedEntity.setId(prototypeId);
        updatedEntity.setName("編集後のプロトタイプ名");
        updatedEntity.setImage("uuid_test.jpg");

        when(prototypeService.updatePrototype(eq(prototypeId), any(PrototypeEditForm.class), eq(1)))
                .thenReturn(updatedEntity);

        // ⏬ 第3引数に mockSession を渡す
        PrototypeEntity result = prototypeController.updatePrototype(prototypeId, editForm, mockSession);

        // 検証
        assertNotNull(result);
        assertEquals("編集後のプロトタイプ名", result.getName());
        verify(prototypeService, times(1)).updatePrototype(eq(prototypeId), any(PrototypeEditForm.class), any());
    }
  @Nested
    @DisplayName("2. プロトタイプ一覧取得機能")
    class GetAllPrototypes {

        @Test
        @DisplayName("2-1. 正常系: 登録済みのプロトタイプ一覧が正常に取得できること")
        void getAllPrototypes_Success() {
            when(prototypeService.findAllPrototypes()).thenReturn(List.of(mockPrototype));

            List<PrototypeEntity> result = prototypeController.showPrototypes();

            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals("テストプロトタイプ", result.get(0).getName());
            verify(prototypeService, times(1)).findAllPrototypes();
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
            when(prototypeService.findById(1)).thenReturn(mockPrototype);

            PrototypeEntity result = prototypeController.showPrototypeDetail(1);

            assertNotNull(result);
            assertEquals(1, result.getId());
            assertEquals("テストプロトタイプ", result.getName());
            assertEquals("テストキャッチコピー", result.getSlogan());
            verify(prototypeService, times(1)).findById(1);
        }

        @Test
        @DisplayName("3-2. 異常系: 存在しないIDを指定した場合、null が返ること")
        void showPrototypeDetail_NotFound() {
            when(prototypeService.findById(999)).thenReturn(null);

            PrototypeEntity result = prototypeController.showPrototypeDetail(999);

            assertEquals(null, result);
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
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }
    }
}
}