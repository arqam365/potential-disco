// @ts-nocheck
import React, {useState, useEffect, useRef} from 'react';
import {CKEditor,} from '@ckeditor/ckeditor5-react';
// InlineEditor
import {
    AccessibilityHelp,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    Bold,
    CloudServices,
    Essentials,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent, InlineEditor,
    Italic,
    Link,
    LinkImage,
    List,
    Paragraph,
    PasteFromOffice,
    SelectAll,
    SimpleUploadAdapter,
    Table,
    TableToolbar,
    TextTransformation,
    Underline,
    Undo
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface CkeditorProps {
    initialValue?: string;
    placeholder?: string;
    onChangeFunction: (id: string, data: string) => void;
    id: string;
}

export default function CkEditorInitialized({
                                                initialValue,
                                                placeholder,
                                                onChangeFunction,
                                                id
                                            }: CkeditorProps) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef<InlineEditor | null>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    useEffect(() => {
        setIsEditorReady(true);

        // return () => {
        //     if (editorRef.current) {
        //         // editorRef.current.destroy().catch(error => console.log(error));
        //     }
        // };
    }, [id]); // Use id to control the re-initialization


    const editorConfig = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'selectAll',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                '|',
                'link',
                'insertImage',
                'insertTable',
                '|',
                'bulletedList',
                'numberedList',
                'indent',
                'outdent',
                '|',
                'accessibilityHelp'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AccessibilityHelp,
            Autoformat,
            AutoImage,
            AutoLink,
            Autosave,
            Bold,
            CloudServices,
            Essentials,
            Heading,
            ImageBlock,
            ImageCaption,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            Italic,
            Link,
            LinkImage,
            List,
            Paragraph,
            PasteFromOffice,
            SelectAll,
            SimpleUploadAdapter,
            Table,
            TableToolbar,
            TextTransformation,
            Underline,
            Undo
        ],
        heading: {
            options: [
                {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'},
                {model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4'},
                {model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5'},
                {model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6'}
            ]
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:alignBlockLeft',
                'imageStyle:block',
                'imageStyle:alignBlockRight',
                '|',
                'resizeImage'
            ],
            styles: {
                options: ['alignBlockLeft', 'block', 'alignBlockRight']
            }
        },
        initialData: initialValue || '',
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        placeholder: placeholder || 'Type or paste your content here!',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
    };

    return (
        <div>
            <div className="">
                <div className="editor-container_inline-editor" ref={editorContainerRef}>
                    <div className="">
                        {isEditorReady && (
                            <CKEditor
                                editor={InlineEditor}
                                onReady={editor => {
                                    editorRef.current = editor;
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    onChangeFunction(id, data);
                                }}
                                config={editorConfig}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
