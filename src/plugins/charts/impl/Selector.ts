import type {Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import { v4 as uuidv4 } from 'uuid';
export abstract class BaseSelector implements Selector{
    public readonly id = uuidv4();

}
