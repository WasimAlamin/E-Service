//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Tanum.ProjektService {
    using System.Runtime.Serialization;
    using System;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="CaseData", Namespace="http://schemas.datacontract.org/2004/07/WcfProjektTest")]
    [System.SerializableAttribute()]
    public partial class CaseData : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int categoryField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string contact_emailField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string contact_phoneField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private System.DateTime dateField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string descriptionField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int idField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private bool isActiveField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string latField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string lngField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int category {
            get {
                return this.categoryField;
            }
            set {
                if ((this.categoryField.Equals(value) != true)) {
                    this.categoryField = value;
                    this.RaisePropertyChanged("category");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string contact_email {
            get {
                return this.contact_emailField;
            }
            set {
                if ((object.ReferenceEquals(this.contact_emailField, value) != true)) {
                    this.contact_emailField = value;
                    this.RaisePropertyChanged("contact_email");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string contact_phone {
            get {
                return this.contact_phoneField;
            }
            set {
                if ((object.ReferenceEquals(this.contact_phoneField, value) != true)) {
                    this.contact_phoneField = value;
                    this.RaisePropertyChanged("contact_phone");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public System.DateTime date {
            get {
                return this.dateField;
            }
            set {
                if ((this.dateField.Equals(value) != true)) {
                    this.dateField = value;
                    this.RaisePropertyChanged("date");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string description {
            get {
                return this.descriptionField;
            }
            set {
                if ((object.ReferenceEquals(this.descriptionField, value) != true)) {
                    this.descriptionField = value;
                    this.RaisePropertyChanged("description");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int id {
            get {
                return this.idField;
            }
            set {
                if ((this.idField.Equals(value) != true)) {
                    this.idField = value;
                    this.RaisePropertyChanged("id");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public bool isActive {
            get {
                return this.isActiveField;
            }
            set {
                if ((this.isActiveField.Equals(value) != true)) {
                    this.isActiveField = value;
                    this.RaisePropertyChanged("isActive");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string lat {
            get {
                return this.latField;
            }
            set {
                if ((object.ReferenceEquals(this.latField, value) != true)) {
                    this.latField = value;
                    this.RaisePropertyChanged("lat");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string lng {
            get {
                return this.lngField;
            }
            set {
                if ((object.ReferenceEquals(this.lngField, value) != true)) {
                    this.lngField = value;
                    this.RaisePropertyChanged("lng");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ProjektService.IService1")]
    public interface IService1 {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/getAllCases", ReplyAction="http://tempuri.org/IService1/getAllCasesResponse")]
        Tanum.ProjektService.CaseData[] getAllCases();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/getAllCases", ReplyAction="http://tempuri.org/IService1/getAllCasesResponse")]
        System.Threading.Tasks.Task<Tanum.ProjektService.CaseData[]> getAllCasesAsync();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/addCase", ReplyAction="http://tempuri.org/IService1/addCaseResponse")]
        void addCase(Tanum.ProjektService.CaseData iCase);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/addCase", ReplyAction="http://tempuri.org/IService1/addCaseResponse")]
        System.Threading.Tasks.Task addCaseAsync(Tanum.ProjektService.CaseData iCase);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/deleteCase", ReplyAction="http://tempuri.org/IService1/deleteCaseResponse")]
        void deleteCase(int id);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/deleteCase", ReplyAction="http://tempuri.org/IService1/deleteCaseResponse")]
        System.Threading.Tasks.Task deleteCaseAsync(int id);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/editCase", ReplyAction="http://tempuri.org/IService1/editCaseResponse")]
        void editCase(int id, int category, string description, bool isActive);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/editCase", ReplyAction="http://tempuri.org/IService1/editCaseResponse")]
        System.Threading.Tasks.Task editCaseAsync(int id, int category, string description, bool isActive);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/logIn", ReplyAction="http://tempuri.org/IService1/logInResponse")]
        bool logIn(string username, string password);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IService1/logIn", ReplyAction="http://tempuri.org/IService1/logInResponse")]
        System.Threading.Tasks.Task<bool> logInAsync(string username, string password);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IService1Channel : Tanum.ProjektService.IService1, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class Service1Client : System.ServiceModel.ClientBase<Tanum.ProjektService.IService1>, Tanum.ProjektService.IService1 {
        
        public Service1Client() {
        }
        
        public Service1Client(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public Service1Client(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public Service1Client(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public Service1Client(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public Tanum.ProjektService.CaseData[] getAllCases() {
            return base.Channel.getAllCases();
        }
        
        public System.Threading.Tasks.Task<Tanum.ProjektService.CaseData[]> getAllCasesAsync() {
            return base.Channel.getAllCasesAsync();
        }
        
        public void addCase(Tanum.ProjektService.CaseData iCase) {
            base.Channel.addCase(iCase);
        }
        
        public System.Threading.Tasks.Task addCaseAsync(Tanum.ProjektService.CaseData iCase) {
            return base.Channel.addCaseAsync(iCase);
        }
        
        public void deleteCase(int id) {
            base.Channel.deleteCase(id);
        }
        
        public System.Threading.Tasks.Task deleteCaseAsync(int id) {
            return base.Channel.deleteCaseAsync(id);
        }
        
        public void editCase(int id, int category, string description, bool isActive) {
            base.Channel.editCase(id, category, description, isActive);
        }
        
        public System.Threading.Tasks.Task editCaseAsync(int id, int category, string description, bool isActive) {
            return base.Channel.editCaseAsync(id, category, description, isActive);
        }
        
        public bool logIn(string username, string password) {
            return base.Channel.logIn(username, password);
        }
        
        public System.Threading.Tasks.Task<bool> logInAsync(string username, string password) {
            return base.Channel.logInAsync(username, password);
        }
    }
}
