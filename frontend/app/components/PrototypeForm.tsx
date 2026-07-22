import { useForm } from 'react-hook-form';

export interface PrototypeFormData {
  name: string;
  slogan: string;
  concept: string;
  image: FileList; // URL文字列から FileList 型に変更
}

interface PrototypeFormProps {
  initialData?: Partial<PrototypeFormData>;
  errorMessages: string[];
  onSubmit: (formData: FormData) => void; // FormData を親に渡す
}

const PrototypeForm = ({ errorMessages, onSubmit, initialData }: PrototypeFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PrototypeFormData>({
    defaultValues: initialData
  });

      // 送信時に React Hook Form のデータを FormData オブジェクトに変換
    const handleFormSubmit = (data: PrototypeFormData) => {
      const formData = new FormData();
      
      formData.append('name', data.name);
      formData.append('slogan', data.slogan);
      formData.append('concept', data.concept);
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]); 
      }

      onSubmit(formData);
    };

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', margin: '20px auto' }}
    >
      {errorMessages.map((error, index) => (
        <div key={index} className="error-message" style={{ color: 'red' }}>{error}</div>
      ))}

      {/* Name */}
      <div>
        <label style={{ display: 'block' }}>Name</label>
        <input
          type="text"
          {...register('name', { required: "Name can't be blank" })}
          placeholder="Name"
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.name && <span className="error-message" style={{ color: 'red' }}>{errors.name.message}</span>}
      </div>

      {/* Slogan */}
      <div>
        <label style={{ display: 'block' }}>Slogan</label>
        <input
          type="text"
          {...register('slogan', { required: "Slogan can't be blank" })}
          placeholder="Slogan"
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.slogan && <span className="error-message" style={{ color: 'red' }}>{errors.slogan.message}</span>}
      </div>

      {/* Concept */}
      <div>
        <label style={{ display: 'block' }}>Concept</label>
        <textarea
          {...register('concept', { required: "Concept can't be blank" })}
          placeholder="Concept"
          rows={5}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.concept && <span className="error-message" style={{ color: 'red' }}>{errors.concept.message}</span>}
      </div>

      {/* Image (ファイル選択に変更) */}
      <div>
        <label style={{ display: 'block' }}>プロトタイプの画像</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', { required: "Image file is required" })}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.image && <span className="error-message" style={{ color: 'red' }}>{errors.image.message}</span>}
      </div>

      <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>
        保存する
      </button>
    </form>
  );
};

export default PrototypeForm;