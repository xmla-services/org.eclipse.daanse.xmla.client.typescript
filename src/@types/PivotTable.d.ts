declare interface ConfiguredHierarchy {
    id: string;
    caption: string;
    originalItem: MDSchemaHierarchy;
    filters: {
        enabled: boolean;
        selectedItem: ?MDSchemaLevel;
        originalItem: ?MDSchemaLevel[];
        multipleChoise: boolean;
        selectAll: ?boolean;
        selectedItems: ?MDSchemaLevel[];
        deselectedItems: ?MDSchemaLevel[];
    };
}
