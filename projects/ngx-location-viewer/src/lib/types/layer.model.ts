export interface Layer {
    id: number;
    name: string;
    visible: boolean;
    layers: Layer[];
}
